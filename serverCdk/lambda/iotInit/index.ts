export const handler = async (event: any) => {
  console.log(event)
  console.log(event.Records[0].kinesis)
  const data = Buffer.from(event.Records[0].kinesis.data, 'base64').toString('utf8')
  console.log('data', data)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello POWERGs!' }),
  }
}
