import logger from '../logger'
import FormData from 'form-data'
import { saveTmpFile } from '../utils'
import lodash from 'loadsh'

export const printerResolvers = {
  Query: {
    printerList: async (_, { pageSize, offset }, { dataSources }) => {
      const allPrinter = await dataSources.CoreAPI.getPrinterList()
      return allPrinter.slice(offset, pageSize + offset).map(printer => {
        return Object.assign({ ...printer }, { uri: printer.uri ? printer.uri : '' })
      })
    }
  },
  Mutation: {
    insertPrinter: async (_, { printerInfo, file }, { dataSources }) => {
      const { rstream, tempFilename } = await saveTmpFile(file)
      const data = new FormData()
      data.append('driver', rstream, tempFilename)
      lodash.forEach(printerInfo, (value, key) => {
        if (value && value.length !== 0) {
          data.append(key, value.toString())
        }
      })
      await dataSources.CoreAPI.createPrinter(data)
      const status = await dataSources.CoreAPI.getPrinterStatusByName(printerInfo.name)
      await dataSources.DBAPI.createPrinter(printerInfo.name, printerInfo.nickname, status)
      return 'insert Printer succeed'
    },
    setPrinter: async (_, { printerInfo, file }, { dataSources }) => {
      const data = new FormData()

      if (file) {
        const { rstream, tempFilename } = await saveTmpFile(file)
        data.append('driver', rstream, tempFilename)
      }
      lodash.forEach(printerInfo, (value, key) => {
        if (value && value.length !== 0) {
          data.append(key, value.toString())
        }
      })
      await dataSources.CoreAPI.updatePrinterByName(data)
      return 'update Printer succeed'
    }
  },
  Printer: {
    nickname: async (parent, __, { dataSources }) => {
      return dataSources.DBAPI.findPrinterByName(parent.name).then(result => result !== null ? result.nickname : '')
    },
    status: async (parent, __, { dataSources }) => {
      return dataSources.CoreAPI.getPrinterStatusByName(parent.name)
    }
  }

}
