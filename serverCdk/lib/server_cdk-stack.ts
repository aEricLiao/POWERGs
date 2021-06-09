import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as s3 from '@aws-cdk/aws-s3'
import * as firehose from '@aws-cdk/aws-kinesisfirehose'
import * as iam from '@aws-cdk/aws-iam'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as iot from '@aws-cdk/aws-iot'
import * as kinesis from '@aws-cdk/aws-kinesis'
import * as eventSource from '@aws-cdk/aws-lambda-event-sources'
import * as cognito from '@aws-cdk/aws-cognito'

export class ServerCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const env = this.node.tryGetContext('env') || 'dev'

    const messageTable = new dynamodb.Table(this, 'messageTable', {
      tableName: 'messageTable',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    })

    // cdk lambda-apigateway example

    const nodeModuleLayer = new lambda.LayerVersion(this, 'nodeModuleLayer', {
      layerVersionName: 'nodeModuleLayer',
      code: lambda.Code.fromAsset('layer/packages'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
    })

    const commonLayer = new lambda.LayerVersion(this, 'commonLayer', {
      layerVersionName: 'commonLayer',
      code: lambda.Code.fromAsset('layer/common'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
    })

    const layers = [nodeModuleLayer, commonLayer]

    const getHelloMessageLambda = new lambda.Function(this, 'getHelloMessageLambda', {
      functionName: 'getHelloMessageLambda',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/helloMessage'),
      handler: 'index.get',
      layers,
    })

    const postHelloMessageLambda = new lambda.Function(this, 'postHelloMessageLambda', {
      functionName: 'postHelloMessageLambda',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/helloMessage'),
      handler: 'index.post',
      environment: {
        TABLE_NAME: messageTable.tableName,
      },
      layers,
    })
    messageTable.grantWriteData(postHelloMessageLambda)

    const restApi = new apigateway.RestApi(this, 'RestApi', {
      restApiName: 'test-api',
    })
    const helloMessageApi = restApi.root.addResource('helloMessage')

    helloMessageApi.addMethod('GET', new apigateway.LambdaIntegration(getHelloMessageLambda))
    helloMessageApi.addMethod('POST', new apigateway.LambdaIntegration(postHelloMessageLambda))

    // S3 Buckets
    const s3Props = {
      enforceSSL: true,
    }
    const logBucket = new s3.Bucket(this, 'logs', {
      bucketName: `powergs-${env}-logs`,
      ...s3Props,
    })
    const _emsBucket = new s3.Bucket(this, 'ems', {
      bucketName: `powergs-${env}-ems`,
      ...s3Props,
    })

    // Firehose
    const firehoseRoleProps = {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      path: '/service-role/',
    }
    const firehoseS3PolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:AbortMultipartUpload',
        's3:GetBucketLocation',
        's3:GetObject',
        's3:ListBucket',
        's3:ListBucketMultipartUploads',
        's3:PutObject',
      ],
      resources: [logBucket.bucketArn, logBucket.arnForObjects('*')],
    })
    const firehoseKinesisPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['kinesis:DescribeStream', 'kinesis:GetShardIterator', 'kinesis:GetRecords', 'kinesis:ListShards'],
      resources: [`arn:aws:kinesis:${this.region}:${this.account}:stream/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`],
    })
    const lambdaLogHoseRole = new iam.Role(this, 'lambdaLogRole', firehoseRoleProps)
    lambdaLogHoseRole.addToPolicy(firehoseS3PolicyStatement)
    lambdaLogHoseRole.addToPolicy(firehoseKinesisPolicyStatement)
    const _lambdaLogHose = new firehose.CfnDeliveryStream(this, 'lambdaLog', {
      deliveryStreamName: 'lambdaLog',
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
    gwInitLogHoseRole.addToPolicy(firehoseS3PolicyStatement)
    const gwInitLogHose = new firehose.CfnDeliveryStream(this, 'gwInitLog', {
      deliveryStreamName: 'gwInitLog',
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
      streamName: 'iotInit',
    })

    // Lambda for IoT
    const iotInitLambda = new lambda.Function(this, 'iotInitLambda', {
      functionName: 'iotInit',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/iotInit'),
      handler: 'index.handler',
    })
    iotInitLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'kinesis:ListStreams',
          'kinesis:ListShards',
          'kinesis:GetShardIterator',
          'kinesis:GetRecords',
          'kinesis:DescribeStream',
        ],
        resources: [`arn:aws:kinesis:${this.region}:${this.account}:stream/*`],
      })
    )
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
      ruleName: 'gwInit',
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
      ruleName: 'gwInitLog',
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
      policyName: 'iotInitPolicy',
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

    // Cognito
    const _userPool = new cognito.UserPool(this, 'userPool', {
      userPoolName: 'userPool',
      autoVerify: { email: true },
      selfSignUpEnabled: true,
      signInCaseSensitive: false,
      standardAttributes: {
        email: { required: true },
      },
    })
  }
}
