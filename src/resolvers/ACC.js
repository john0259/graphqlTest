import { GraphQLJSONObject } from 'graphql-type-json'
import { paginateResults } from '../utils'
import logger from '../logger'

export const ACCResolvers = {
  JSONObject: GraphQLJSONObject,
  Query: {
    ACCList: async (_, { pageSize = 20, after }, { dataSources }) => {
      try {
        logger.info(await dataSources.CoreAPI.getPrinterList())
        const allACCes = await dataSources.ACCAPI.getAllACCs()
        const accs = paginateResults({
          after,
          pageSize,
          results: allACCes
        })
        return {
          accs: accs,
          cursor: accs.length ? accs[accs.length - 1].cursor : null,
          hasMore: accs.length
            ? accs[accs.length - 1].cursor !==
            allACCes[allACCes.length - 1].cursor : false
        }
      } catch (err) {
        logger.error(err)
        throw err
      }
    }
  },
  Mutation: {
    insertACC: async (_, args, { dataSources }) => {
      const { AccContent } = args
      const acc = await dataSources.ACCAPI.insertAcc(AccContent)
      logger.info(acc)
      return acc
    }
  }

}
