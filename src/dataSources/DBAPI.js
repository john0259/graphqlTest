import { DataSource } from 'apollo-datasource'
import { accService, printerService, userService } from '../DBService/servicesInstance'
import Moment from 'moment/moment'
import Boom from '@hapi/boom'

export default class DBAPI extends DataSource {
  initialize(config) {
    this.context = config.context
  }

  async insertACC(accInput) {
    const findACC = await accService.queryDocuments({ name: accInput.name })
    if (findACC.length > 0) throw Boom.badRequest('name is existed')
    return await accService.insertDocument(accInput).then(result => this.ACCReducer(result.new))
  }

  async deleteACC(name) {
    const findACC = await accService.queryDocuments({ name })
    if (!findACC.length) throw Boom.notFound(`name: ${name} ACC not Found.`)
    await accService.removeDocument(findACC[0])
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
      return await userService.insertDocument({ _key: userInput.userName, roles: userInput.roles })
        .then(result => this.userReducer(result.new))
    } catch (err) {
      throw Boom.badRequest('User is existed')
    }
  }

  async findUserByName(userName) {
    const result = await userService.queryDocuments({ _key: userName })
    if (!result.length) throw Boom.notFound(`${userName} is not sign up`)
    return this.userReducer(result[0])
  }

  async setRolesByName(userName, roles) {
    try {
      return await userService.updateByQuery({ _key: userName }, { roles })
        .then(result => this.userReducer(result[0].new))
    } catch (err) {
      console.log(err)
      if (err.code === 'ERR_DOC_NOT_FOUND') {
        throw Boom.notFound(`${userName} not Found`)
      } else {
        throw Boom.internal()
      }
    }
  }

  userReducer(data) {
    return {
      userName: data._key,
      roles: data.roles
    }
  }

  async createPrinter(name, nickname) {
    await printerService.insertDocument({ _key: name, nickname })
  }

  async findPrinterByName(name) {
    const result = await printerService.queryDocuments({ _key: name })
    return result.length ? result[0] : null
  }
}
