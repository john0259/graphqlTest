import { RESTDataSource } from 'apollo-datasource-rest'
import config from '../config'
import logger from '../logger'

export default class CoreAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `http://${config.coreServer.host}:${config.coreServer.port}/api/`
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }

  async getPrinterList() {
    return this.get('/printDriver/printerList')
  }
}
