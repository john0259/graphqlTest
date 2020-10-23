import { RESTDataSource } from 'apollo-datasource-rest'
import config from '../config'
import FormData from 'form-data'
import Boom from '@hapi/boom'
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
    if (request.body && typeof request.body === 'object' && !(request.body instanceof FormData)) {
      request.body = { ...request.body }
    }
  }

  async didReceiveResponse(response, request) {
    if (response.ok) {
      return this.parseBody(response).then(result => result.data)
    } else {
      const error = await this.errorFromResponse(response)
      console.log()
      throw Boom.boomify(error, {
        message: error.extensions.response.body.error.message,
        statusCode: error.extensions.response.status
      })
    }
  }

  async createPrinter(printer) {
    return this.post('/printDriver/printer', printer)
  }

  async getPrinterList() {
    return this.get('/printDriver/printerList').then(result => result.printers)
  }

  async getPrinterStatusByName(name) {
    return this.get(`/printDriver/printerStatus?name=${name}`).then(result => result.status)
  }

  async createUser(user) {
    return this.post('/users', user)
  }

  async login(userName, password) {
    return this.post('/users/authenticate', { userName, password })
  }
}
