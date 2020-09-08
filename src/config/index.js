import dotenv from 'dotenv'
import path from 'path'

dotenv.config()
const rootDir = path.resolve(__dirname, '../..')
const env = process.env.NODE_ENV || 'development'
const configs = {
  base: {
    env,
    name: process.env.APP_NAME || 'PDS-WEB-APP',
    host: process.env.APP_HOST || '0.0.0.0',
    port: process.env.APP_PORT || 4000,
    root: rootDir,
    coreServer: {
      host: process.env.PDS_HOST || 'localhost',
      port: process.env.PDS_PORT || 8080
    },
    logger: {
      directory: process.env.LOG_DIRECTORY || path.join(__dirname, '../../logs/'),
      fileName: process.env.LOG_FILENAME,
      level: process.env.LOG_LEVEL || 'info'
    },
    arangoDB: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 8529,
      username: process.env.DB_USERNAME || 'pds',
      password: process.env.DB_PASSWORD || 'belstar123',
      dbName: process.env.DB_DATABASE_NAME || 'PDS'
    },
    authorization: process.env.AUTH_SALT
  },
  production: {},
  development: {},
  test: {}
}
const config = Object.assign(configs.base, configs[env])

export default config
