import * as cdk from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { removalPolicy } from '../../common'

interface DynamodbStackProps {
  env: string
}

export class DynamodbStack extends cdk.Stack {
  public readonly messageTable: dynamodb.Table
  public readonly userTable: dynamodb.Table
  public readonly emsManagementCompanyTable: dynamodb.Table

  constructor(scope: cdk.Construct, id: string, props: DynamodbStackProps) {
    super(scope, id)

    const env = props.env

    this.messageTable = new dynamodb.Table(this, 'messageTable', {
      tableName: `messageTable-${env}`,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: removalPolicy(env),
    })

    this.userTable = new dynamodb.Table(this, 'userTable', {
      tableName: `userTable-${env}`,
      partitionKey: { name: 'company_customer_id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'mailaddress', type: dynamodb.AttributeType.STRING },
    })

    this.emsManagementCompanyTable = new dynamodb.Table(this, 'emsManagementCompanyTable', {
      tableName: `emsManagementCompanyTable-${env}`,
      partitionKey: { name: '_id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'domain_name', type: dynamodb.AttributeType.STRING },
    })
  }
}
