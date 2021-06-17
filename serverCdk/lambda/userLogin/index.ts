import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { postLambdaLog } from 'common'

const client = new DynamoDBClient({})
const userTableName = process.env.USER_TABLE_NAME ?? ''
const emsManagementCompanyTable = process.env.EMS_MANAGEMENT_COMPANY_TABLE_NAME ?? ''

export const get = async (event: any) => {
  postLambdaLog(event)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello POWERGs!' }),
  }
}
