import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';

export class ServerCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
  }
}
