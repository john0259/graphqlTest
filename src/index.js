import { ApolloServer, AuthenticationError } from 'apollo-server'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import { secret } from './config/token'
import { User } from './typeDefs/types/userType'

import { IsAuthenticatedDirective, AuthDirective } from './directives/directives'
import DBAPI from './dataSources/DBAPI'
import CoreAPI from './dataSources/coreAPI'
import jwt from 'jsonwebtoken'

const server = new ApolloServer({
  context: async ({ req }) => {
    const token = req.headers.authorization
    const result = { req }
    if (token) {
      try {
        const user = await jwt.verify(token, secret)
        result.user = new User(user)
      } catch (err) {
        throw new AuthenticationError('token expired.')
      }
    }
    return result
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    DBAPI: new DBAPI(),
    CoreAPI: new CoreAPI()
  }),
  schemaDirectives: {
    isAuthenticated: IsAuthenticatedDirective,
    auth: AuthDirective
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
