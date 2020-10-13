import { RESTDataSource } from 'apollo-datasource-rest'
import config from '../config'
import logger from '../logger'

export default class CoreAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `http://${config.coreServer.host}:${config.coreServer.port}/api/`
  }

  willSendRequest(request) {
    if (this.context.user) {
      request.headers.set('Authorization', `Bearer ${this.context.user.token}`)
    }
    if (request.body && typeof request.body === 'object') {
      request.body = { ...request.body }
    }
  }

  async getPrinterList() {
    return this.get('/printDriver/printerList')
  }

  async createUser(user) {
    return this.post('/users', user)
  }

  async login(userName, password) {
    return this.post('/users/authenticate', { userName, password })
  }
}
