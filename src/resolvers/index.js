import { ACCResolvers } from './ACC'
import logger from '../logger'
import { createWriteStream, unlink } from 'fs'

const utilsResolver = {
  Mutation: {
    uploadFile: async (parent, { files }) => {
      try {
        files.map(async (file) => {
          const { createReadStream, filename } = await file
          const stream = createReadStream()

          await new Promise((resolve, reject) => {
            stream.on('error', (error) => {
              unlink(filename, () => reject(error))
              logger.log('writerror....', error)
            })
              .pipe(createWriteStream(filename))
              .on('error', reject)
              .on('finish', resolve)
          })
          logger.info(file)
        })
        // const { createReadStream, filename } = await file
        // const stream = createReadStream()
        // await new Promise((resolve, reject) => {
        //   stream.on('error', error => {
        //     logger.error(error)
        //     reject(error)
        //   }).pipe(createWriteStream(filename))
        //     .on('error', reject)
        //     .on('finish', resolve)
        // })
      } catch (e) {
        logger.error(e)
      }
      return files
    }
  }
}

export const resolvers = [ACCResolvers, utilsResolver]
