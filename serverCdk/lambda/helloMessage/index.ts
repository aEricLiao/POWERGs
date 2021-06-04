export const get = async (event: any) => {
  console.log(event)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello POWERGs!' }),
  }
}
