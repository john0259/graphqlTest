import { gql } from 'apollo-server'

export const query = gql`
  directive @isAuthenticated on FIELD_DEFINITION
  directive @auth(requires: UserRole = ADMIN, ) on OBJECT | FIELD_DEFINITION
  
    type Query {
        ACCList(
            """
            The number of results ti show. Must be >= 1. Default = 20
            """
            pageSize: Int
            after: String
        ): ACCConnection! @isAuthenticated
    }

    type Mutation {
        signUp(userInfo: UserInput!): String
        login(userName: String!, password: String!): String
        insertACC(AccContent: ACCInput!): ACC @isAuthenticated
        uploadFile(files: [Upload]!): [File] @isAuthenticated
    }

    type ACCConnection {
        cursor: String!
        hasMore: Boolean!
        accs: [ACC]!
    }
`
