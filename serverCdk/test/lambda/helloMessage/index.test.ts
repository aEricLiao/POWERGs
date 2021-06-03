import { get } from '../../../lambda/helloMessage/index'

test("lambda response", async () => {
  const expected = { statusCode: 200, body: JSON.stringify({ message: "Hello POWERGs!" }) }

  const input = {}
  const response = await get(input)
  expect(response.statusCode).toBe(expected.statusCode)
  expect(response.body).toBe(expected.body)
})
