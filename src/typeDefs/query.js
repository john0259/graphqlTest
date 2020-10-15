import { gql } from 'apollo-server'

export const query = gql`
  directive @isAuthenticated on FIELD_DEFINITION
  directive @auth(requires: UserRole = ADMIN, ) on OBJECT | FIELD_DEFINITION
  
    type Query {
        ACCList(
            """
            The number of results ti show. Must be >= 1. Default = 20
            """
            pageSize: Int = 20
            after: String
        ): ACCConnection! @auth(requires: MANAGER) @isAuthenticated
    }

    type Mutation {
        """
        註冊帳號
        """
        signUp(userInfo: UserInput!): String
        """
        帳號登入
        """
        login(userName: String!, password: String!): String
        insertACC(AccContent: ACCInput!): ACC @isAuthenticated @auth(requires: MANAGER)
        deleteACC(name: String!): String @auth(requires: MANAGER) @isAuthenticated
        uploadFile(files: [Upload]!): [File] @isAuthenticated
    }

    type ACCConnection {
        cursor: String!
        hasMore: Boolean!
        accs: [ACC]!
    }
`
