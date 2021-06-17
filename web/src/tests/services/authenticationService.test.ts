import { mockService } from '@src/services/authenticationService'

describe('test authenticationService with mock api', () => {
  const service = mockService()

  test('login', (done) => {
    service.login().then(() => {
      done()
    })
  })
  test('logout', (done) => {
    service.logout().then(() => {
      done()
    })
  })
  test('setPassword', (done) => {
    service.setPassword().then(() => {
      done()
    })
  })
  test('sendEmail', (done) => {
    service.setPassword().then(() => {
      done()
    })
  })
  test('signup', (done) => {
    service.setPassword().then(() => {
      done()
    })
  })
})
