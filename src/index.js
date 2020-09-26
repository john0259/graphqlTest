import { ApolloServer } from 'apollo-server'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import DBAPI from './dataSources/DBAPI'
import CoreAPI from './dataSources/coreAPI'

const server = new ApolloServer({
  context: ({ req }) => {
    return {
      req,
      token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQkpQRFMwMSIsInRva2VuIjoiZWZIQUNMSEdQeWNYLUs1Rm5HcXpONDc0c2F2MzlydUZYaEVJNWFxSmFMTjBtdDFHYXBLS2owclJPV1Q5N2lNZyIsImlhdCI6MTU5OTQ2MzI4NSwiZXhwIjoxNjAyMDU1Mjg1fQ.icxc6XgHegBw5RFctZjVT-GRn-75obyrSoQ1zRbAcEA'
    }
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    DBAPI: new DBAPI(),
    CoreAPI: new CoreAPI()
  })
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
