import { DataSource } from 'apollo-datasource'
import { accService, userService } from '../DBService/servicesInstance'
import Moment from 'moment/moment'
import Boom from '@hapi/boom'

export default class DBAPI extends DataSource {
  initialize(config) {
    this.context = config.context
  }

  async insertAcc(accInput) {
    const findAcc = await accService.queryDocuments({ name: accInput.name })
    if (findAcc.length > 0) throw Boom.badData('name is existed')
    return await accService.insertACC(accInput).then(result => this.ACCReducer(result.new))
  }

  async getAllACCs() {
    const allACCes = await accService.findAll({ sort: { createTime: -1 } })
    return Array.isArray(allACCes) ? allACCes.map(acc => this.ACCReducer(acc)) : []
  }

  ACCReducer(ACC) {
    delete ACC._key
    delete ACC._id
    delete ACC._rev
    return {
      ...ACC,
      cursor: (+Moment(ACC.createTime)).toString()
    }
  }

  async createUser(userInput) {
    try {
      const user = await userService.insertDocument(userInput)
    } catch (err) {

    }
  }
}
