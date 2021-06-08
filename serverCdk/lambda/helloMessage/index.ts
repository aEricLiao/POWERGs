import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'

const client = new DynamoDBClient({})
const tableName = process.env.TABLE_NAME ?? ''

export const get = async (event: any) => {
  console.log(event)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello POWERGs!' }),
  }
}

export const post = async (event: any) => {
  console.log(event)
  const id = JSON.parse(event.body).id

  const param: PutItemCommandInput = { TableName: tableName, Item: marshall({ id, message: 'Hello POWERGs!' }) }
  const command = new PutItemCommand(param)
  await client.send(command)
  return { statusCode: 200 }
}
