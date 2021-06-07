import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as s3 from '@aws-cdk/aws-s3'
import * as firehose from '@aws-cdk/aws-kinesisfirehose'
import * as iam from '@aws-cdk/aws-iam'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export class ServerCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const env = this.node.tryGetContext('env') || 'dev'

    const messageTable = new dynamodb.Table(this, 'messageTable', {
      tableName: 'messageTable',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    })

    // cdk lambda-apigateway example
    const getHelloMessageLambda = new lambda.Function(this, 'getHelloMessageLambda', {
      functionName: 'getHelloMessageLambda',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/helloMessage'),
      handler: 'indexBundle.get',
    })

    const postHelloMessageLambda = new lambda.Function(this, 'postHelloMessageLambda', {
      functionName: 'postHelloMessageLambda',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/helloMessage'),
      handler: 'indexBundle.post',
      environment: {
        TABLE_NAME: messageTable.tableName,
      }
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
    const lambdaLogHoseRole = new iam.Role(this, 'lambdaLogRole', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      path: '/service-role/',
    })
    lambdaLogHoseRole.addToPolicy(
      new iam.PolicyStatement({
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
    )
    lambdaLogHoseRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['kinesis:DescribeStream', 'kinesis:GetShardIterator', 'kinesis:GetRecords', 'kinesis:ListShards'],
        resources: [`arn:aws:kinesis:${this.region}:${this.account}:stream/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`],
      })
    )
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
  }
}
