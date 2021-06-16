import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as s3 from '@aws-cdk/aws-s3'
import * as firehose from '@aws-cdk/aws-kinesisfirehose'
import * as iam from '@aws-cdk/aws-iam'
import * as iot from '@aws-cdk/aws-iot'
import * as kinesis from '@aws-cdk/aws-kinesis'
import * as eventSource from '@aws-cdk/aws-lambda-event-sources'
import { removalPolicy } from '../../common'
import { firehoseRoleProps, firehoseS3PolicyStatement, firehoseKinesisPolicyStatement, iotInitLambdaKinesisPolicyStatement } from './iam'

export class ServerCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const env = this.node.tryGetContext('env') || 'dev'

    // Firehose
    const s3Props = {
      enforceSSL: true,
    }
    const logBucket = new s3.Bucket(this, 'logsBucket', {
      bucketName: `powergs-${env}-logs`,
      ...s3Props,
      removalPolicy: removalPolicy(env),
    })

    const lambdaLogHoseRole = new iam.Role(this, 'lambdaLogRole', firehoseRoleProps)
    lambdaLogHoseRole.addToPolicy(firehoseS3PolicyStatement(logBucket))
    lambdaLogHoseRole.addToPolicy(firehoseKinesisPolicyStatement(this.region, this.account))

    const _lambdaLogHose = new firehose.CfnDeliveryStream(this, 'lambdaLog', {
      deliveryStreamName: `lambdaLog-${env}`,
      extendedS3DestinationConfiguration: {
        bucketArn: logBucket.bucketArn,
        roleArn: lambdaLogHoseRole.roleArn,
        prefix: 'lambda/',
        bufferingHints: {
          intervalInSeconds: 300, // default
          sizeInMBs: 5, // default
        },
        compressionFormat: 'GZIP',
      },
    })

    const gwInitLogHoseRole = new iam.Role(this, 'gwInitLogRole', firehoseRoleProps)
    gwInitLogHoseRole.addToPolicy(firehoseS3PolicyStatement(logBucket))
    const gwInitLogHose = new firehose.CfnDeliveryStream(this, 'gwInitLog', {
      deliveryStreamName: `gwInitLog-${env}`,
      extendedS3DestinationConfiguration: {
        bucketArn: logBucket.bucketArn,
        roleArn: gwInitLogHoseRole.roleArn,
        prefix: 'iot_gw_init/!{timestamp: yyyy/MM/dd}/',
        errorOutputPrefix: 'iot_gw_init/!{timestamp: yyyy/MM/dd}/!{firehose:error-output-type}/',
        compressionFormat: 'UNCOMPRESSED',
        encryptionConfiguration: {
          noEncryptionConfig: 'NoEncryption',
        },
      },
    })

    // Kinesis Data Stream
    const iotInitStream = new kinesis.Stream(this, 'iotInitStream', {
      streamName: `iotInit-${env}`,
    })

    // Lambda for IoT
    const iotInitLambda = new lambda.Function(this, 'iotInitLambda', {
      functionName: `iotInit-${env}`,
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/iotInit'),
      handler: 'index.handler',
    })
    iotInitLambda.addToRolePolicy(iotInitLambdaKinesisPolicyStatement(this.region, this.account))
    iotInitLambda.addEventSource(
      new eventSource.KinesisEventSource(iotInitStream, {
        batchSize: 5, // default: 100
        maxBatchingWindow: cdk.Duration.seconds(1),
        startingPosition: lambda.StartingPosition.LATEST,
      })
    )

    // IoT Core
    const iotRoleProps = {
      assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
      path: '/service-role/',
    }
    const kinesisPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['kinesis:PutRecord'],
      resources: [iotInitStream.streamArn],
    })
    const firehosePolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['firehose:PutRecord'],
      resources: [gwInitLogHose.attrArn],
    })
    const iotInitRuleRole = new iam.Role(this, 'iotInitRuleRole', iotRoleProps)
    iotInitRuleRole.addToPolicy(kinesisPolicyStatement)
    const _iotInitRule = new iot.CfnTopicRule(this, 'iotInitRule', {
      ruleName: `iotInitRule-${env}`,
      topicRulePayload: {
        sql: "SELECT *, topic() as topic, timestamp() as timestamp FROM 'init/+/sv'",
        awsIotSqlVersion: '2016-03-23',
        actions: [
          {
            kinesis: {
              roleArn: iotInitRuleRole.roleArn,
              streamName: iotInitStream.streamName,
            },
          },
        ],
      },
    })
    const gwInitLogRuleRole = new iam.Role(this, 'gwInitLogRuleRole', iotRoleProps)
    gwInitLogRuleRole.addToPolicy(firehosePolicyStatement)
    const _gwInitLogRule = new iot.CfnTopicRule(this, 'gwInitLogRule', {
      ruleName: `gwInitLogRule-${env}`,
      topicRulePayload: {
        sql: "SELECT *, topic() as topic, timestamp() as timestamp FROM 'init/+/gw'",
        awsIotSqlVersion: '2016-03-23',
        ruleDisabled: false,
        actions: [
          {
            firehose: {
              deliveryStreamName: gwInitLogHose.deliveryStreamName!,
              roleArn: gwInitLogRuleRole.roleArn,
              batchMode: false,
            },
          },
        ],
      },
    })
    const iotInitPolicy = new iot.CfnPolicy(this, 'iotInitPolicy', {
      policyName: `iotInitPolicy-${env}`,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: 'iot:Connect',
            Resource: `arn:aws:iot:${this.region}:${this.account}:client/*`,
          },
          {
            Effect: 'Allow',
            Action: 'iot:Publish',
            Resource: `arn:aws:iot:${this.region}:${this.account}:topic/init/*/sv`,
          },
          {
            Effect: 'Allow',
            Action: 'iot:Receive',
            Resource: `arn:aws:iot:${this.region}:${this.account}:topic/init/*/gw`,
          },
          {
            Effect: 'Allow',
            Action: 'iot:Subscribe',
            Resource: `arn:aws:iot:${this.region}:${this.account}:topicfilter/init/*/gw`,
          },
        ],
      },
    })
  }
}
