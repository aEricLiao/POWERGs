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
}

const serviceCreator = (): AuthenticationServiceApi => {
  const axiosInstance = createInstance()
  return {
    axiosInstance,
    login: () => axiosInstance.get('/login'),
    logout: () => axiosInstance.get('/logout'),
  }
}

const mockService = (): AuthenticationServiceApi => {
  const service = serviceCreator()
  const mock = new MockAdapter(service.axiosInstance)
  mock.onGet('/login').reply(200)
  mock.onGet('/logout').reply(200)
  return service
}

export default AXIOS_MOCK_ENABLE ? mockService : serviceCreator