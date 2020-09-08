import ArangodbService from './arangoDBServices'
import Moment from 'moment/moment'

export default class CollectionService extends ArangodbService {
  constructor(connConfig, collectionName) {
    super()
    this._collection = collectionName
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
}
