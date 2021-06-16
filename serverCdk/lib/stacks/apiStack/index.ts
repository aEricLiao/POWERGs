import * as cdk from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigateway from '@aws-cdk/aws-apigateway'

interface ApiStackProps {
  env: string
  messageTable: dynamodb.Table
}

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ApiStackProps) {
    super(scope, id)

    const { env, messageTable } = props

    const nodeModuleLayer = new lambda.LayerVersion(this, 'nodeModuleLayer', {
      layerVersionName: `nodeModuleLayer-${env}`,
      code: lambda.Code.fromAsset('layer/packages'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
    })
    const commonLayer = new lambda.LayerVersion(this, 'commonLayer', {
      layerVersionName: `commonLayer-${env}`,
      code: lambda.Code.fromAsset('layer/common'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
    })
    const layers = [nodeModuleLayer, commonLayer]

    const getHelloMessageLambda = new lambda.Function(this, 'getHelloMessageLambda', {
      functionName: `getHelloMessageLambda-${env}`,
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/helloMessage'),
      handler: 'index.get',
      layers,
    })
    const postHelloMessageLambda = new lambda.Function(this, 'postHelloMessageLambda', {
      functionName: `postHelloMessageLambda-${env}`,
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
      restApiName: `test-api-${env}`,
    })
    const helloMessageApi = restApi.root.addResource('helloMessage')

    helloMessageApi.addMethod('GET', new apigateway.LambdaIntegration(getHelloMessageLambda))
    helloMessageApi.addMethod('POST', new apigateway.LambdaIntegration(postHelloMessageLambda))
  }
}
