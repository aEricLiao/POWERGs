import { marshall } from '@aws-sdk/util-dynamodb'

export const postLambdaLog = (content: string) => {
  console.log(content)
  console.log(marshall({ id: 'test', message: 'Hello POWERGs!' }))
}
