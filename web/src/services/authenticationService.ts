import axios, { AxiosInstance, AxiosResponse } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { AXIOS_MOCK_ENABLE } from '@src/constants/environment'

const createInstance = () =>
  axios.create({
    baseURL: '/',
  })

interface AuthenticationServiceApi {
  axiosInstance: AxiosInstance
  login: () => Promise<AxiosResponse<any>>
  logout: () => Promise<AxiosResponse<any>>
  setPassword: () => Promise<AxiosResponse<any>>
  sendEmail: () => Promise<AxiosResponse<any>>
  signup: (payload: Record<string, any>) => Promise<AxiosResponse<any>>
}

const serviceCreator = (): AuthenticationServiceApi => {
  const axiosInstance = createInstance()
  return {
    axiosInstance,
    login: () => axiosInstance.get('/login'),
    logout: () => axiosInstance.get('/logout'),
    setPassword: () => axiosInstance.get('/setPassword'),
    sendEmail: () => axiosInstance.get('/passwordChangeEmail'),
    signup: (payload) => axiosInstance.post('/signup', payload),
  }
}

export const mockService = (): AuthenticationServiceApi => {
  const service = serviceCreator()
  const mock = new MockAdapter(service.axiosInstance)
  mock.onGet('/login').reply(200)
  mock.onGet('/logout').reply(200)
  mock.onGet('/setPassword').reply(200)
  mock.onGet('/passwordChangeEmail').reply(200)
  mock.onPost('/signup').reply(200)
  return service
}

export default AXIOS_MOCK_ENABLE ? mockService : serviceCreator
