import CollectionService from './collectionSerives'
import { v4 as uuidV4 } from 'uuid'
import Moment from 'moment/moment'

export default class ACCService extends CollectionService {
  constructor() {
    super(null, 'ACC')
  }

  async insertACC(accJson) {
    const Data = {
      _key: uuidV4(),
      ...accJson,
      createTime: Moment().toISOString(true)
    }
    console.log(Data)
    return super.saveDocument(this._collection, Data)
  }

  /**
   * @param options {object}: 擴充功能 =>{offset:起始位址,limit:幾筆}
   * @returns {Promise<*|Array>}
   */
  async findAll(options) {
    return super.findAll(this._collection, options)
  }
}
