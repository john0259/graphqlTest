import { secret } from '../config/token'
import jwt from 'jsonwebtoken'
import logger from '../logger'

export const userResolvers = {
  Mutation: {
    signUp: async (_, { userInfo }, { dataSources }) => {
      const coreUser = Object.assign({}, userInfo)
      delete coreUser.roles
      delete userInfo.password
      await dataSources.CoreAPI.createUser(coreUser)
      const newUser = await dataSources.DBAPI.createUser(userInfo)
      const token = await dataSources.CoreAPI.login(coreUser.userName, coreUser.password).then(result => result.token)
      return await createToken({ userName: newUser.username, roles: newUser.roles, token })
    },
    login: async (_, { userName, password }, { dataSources }) => {
      const token = await dataSources.CoreAPI.login(userName, password).then(result => result.token)
      const result = await dataSources.DBAPI.findUserByName(userName)
      return await createToken({ userName: result.userName, roles: result.roles, token })
    },
    setRoleByUserName: async (_, { userName, roles }, { dataSources }) => {
      const user = await dataSources.DBAPI.setRolesByName(userName, roles)
      logger.info(user)
      return user
    }

  }
}

async function createToken({ userName, token, roles }) {
  return jwt.sign({ userName, token, roles }, secret, { expiresIn: '1d' })
}
