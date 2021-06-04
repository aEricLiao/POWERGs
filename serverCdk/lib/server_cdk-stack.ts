import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as s3 from '@aws-cdk/aws-s3'

export class ServerCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const env = this.node.tryGetContext('env') || 'dev';

    // cdk lambda-apigateway example
    const getHelloMessageLambda = new lambda.Function(this, 'getHelloMessageLambda', {
      functionName: "getHelloMessageLambda",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/helloMessage'),
      handler: 'index.get'
    })

    const restApi = new apigateway.RestApi(this, 'RestApi', {
      restApiName: 'test-api'
    })
    const helloMessageApi = restApi.root.addResource('helloMessage')

    helloMessageApi.addMethod('GET', new apigateway.LambdaIntegration(getHelloMessageLambda))

    // S3 Buckets
    const s3Props = {
      enforceSSL: true,
    }
    const _logBucket = new s3.Bucket(this, 'logs', {
      bucketName: `powergs-${env}-logs`,
      ...s3Props
    });
    const _emsBucket = new s3.Bucket(this, 'ems', {
      bucketName: `powergs-${env}-ems`,
      ...s3Props
    });
  }
}
