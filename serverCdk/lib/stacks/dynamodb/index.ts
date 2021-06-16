import * as cdk from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { removalPolicy } from '../../common'

interface DynamodbStackProps {
  env: string
}

export class DynamodbStack extends cdk.Stack {
  public readonly messageTable: dynamodb.Table

  constructor(scope: cdk.Construct, id: string, props: DynamodbStackProps) {
    super(scope, id)

    const env = props.env

    this.messageTable = new dynamodb.Table(this, 'messageTable', {
      tableName: `messageTable-${env}`,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: removalPolicy(env),
    })
  }
}
