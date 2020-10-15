import logger from '../logger'
import FormData from 'form-data'
import { createWriteStream, unlink } from 'fs'

export const printerResolvers = {
  Query: {
    printerList: async (_, { pageSize, offset }, { dataSources }) => {
      const allPrinter = await dataSources.CoreAPI.getPrinterList()
      return allPrinter.slice(offset, pageSize + offset)
    }
  },
  Mutation: {
    insertPrinter: async (_, { printerInfo }, { dataSources }) => {
      console.log(1)
      const corePrinter = Object.assign({}, printerInfo)
      delete corePrinter.nickname

      // const { createReadStream, filename } = await file
      // const tempFilename = `/tmp/${Date.now()}/${filename}`
      // const stream = createReadStream()
      //
      // await new Promise((resolve, reject) => {
      //   stream
      //     .pipe(createWriteStream(tempFilename))
      //     .on('finish', resolve)
      //     .on('error', (error) => {
      //       unlink(tempFilename, () => reject(error))
      //       console.log('writerror....', error)
      //     })
      // })
      // const rstream = createReadStream(tempFilename)
      const data = new FormData()
      // data.append('driver', rstream)
      data.append('name', corePrinter.name)
      data.append('ip', corePrinter.ip)
      data.append('driverType', corePrinter.driverType)
      data.append('manufacturer', corePrinter.manufacturer)
      data.append('model', corePrinter.model)
      data.append('uri', corePrinter.uri)
      data.append('trayInfo', corePrinter.trayInfo.toString())
      await dataSources.CoreAPI.createPrinter(data)
      // await dataSource.DBAPI
    }
  }

}
