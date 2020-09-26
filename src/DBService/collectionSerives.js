import ArangodbService from './arangoDBServices'
import Moment from 'moment/moment'
import { v4 as uuidV4 } from 'uuid'

export default class CollectionService extends ArangodbService {
  constructor(connConfig, collectionName) {
    super()
    this._collection = collectionName
  }

  async insertDocument(jsonData) {
    const Data = {
      _key: uuidV4(),
      ...jsonData,
      createTime: Moment().toISOString(true)
    }
    return super.saveDocument(this._collection, Data)
  }

  /**
   * 依照給定條件搜尋Job
   * @param queryJson: Object
   *          資料格式為json. ex:{jobUuhId: string}
   * @param opt
   * @returns {Promise<*>}: Array(Object)
   *            document array
   */
  async queryDocuments(queryJson, opt) {
    return super.findByCondition(
      this._collection,
      queryJson,
      opt
    )
  }

  /**
   * 依照query 更新 Job
   * @param query: Object
   *          query 物件 ex.{batchId: string}
   * @param updateJson: Object
   *          要更新的資料 ex.{status: 'waiting'}
   * @returns {Promise<any>}: Array(Object)
   *            回傳更新後的documents 存放於Object.new中
   */
  async updateByQuery(query, updateJson) {
    const jobDocs = await this.queryDocuments(query)
    if (jobDocs.length !== 0) {
      updateJson.modifyTime = Moment().toISOString(true)
      const newJobDocs = jobDocs.map(item => {
        return Object.assign({}, item, updateJson)
      })
      return super.updateDocuments(this._collection, newJobDocs)
    } else {
      const error = new Error('Document not found.')
      error.code = 'ERR_DOC_NOT_FOUND'
      throw error
    }
  }

  /**
   * 依照documentHandler刪除文件
   * @param {object} documentHandler 須包含_key或_id
   * @returns {Promise<any>}
   */
  async removeDocument(documentHandler) {
    await super.removeDocument(this._collection, documentHandler)
  }

  /**
   * @param options {object}: 擴充功能 =>{offset:起始位址,limit:幾筆}
   * @returns {Promise<*|Array>}
   */
  async findAll(options) {
    return super.findAll(this._collection, options)
  }
}
