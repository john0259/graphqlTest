import logger from '../logger'
import FormData from 'form-data'
import { createWriteStream, unlink } from 'fs'

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
      console.log(process.cwd())
      const { createReadStream, filename } = await file
      const tempFilename = `./tmp/${filename}`
      const stream = createReadStream()

      await new Promise((resolve, reject) => {
        stream
          .pipe(createWriteStream(tempFilename))
          .on('finish', resolve)
          .on('error', (error) => {
            unlink(tempFilename, () => reject(error))
            console.log('writerror....', error)
          })
      })
      const rstream = createReadStream(tempFilename)
      const data = new FormData()
      data.append('driver', rstream, filename)
      data.append('name', printerInfo.name)
      data.append('ip', printerInfo.ip)
      data.append('driverType', printerInfo.driverType)
      data.append('manufacturer', printerInfo.manufacturer)
      data.append('model', printerInfo.model)
      data.append('uri', printerInfo.uri)
      data.append('trayInfo', printerInfo.trayInfo.toString())
      await dataSources.CoreAPI.createPrinter(data)
      await dataSources.DBAPI.createPrinter(printerInfo.name, printerInfo.nickname)
      return 'insert Printer succeed'
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
