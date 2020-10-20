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
        printerList(
            """
            The number of results ti show. Must be >= 1. Default = 20
            """
            pageSize: Int = 20
            """
            Default = 0
            """
            offset: Int! = 0
        ): [Printer]!
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
        insertPrinter(printerInfo: PrinterInput!, file: Upload): String
        uploadFile(files: [Upload]!): [File]
    }

    type ACCConnection {
        cursor: String!
        hasMore: Boolean!
        accs: [ACC]!
    }
`
