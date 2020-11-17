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
        ): ACCConnection! @auth(requires: WORKER) @isAuthenticated
        printerList(
            """
            The number of results ti show. Must be >= 1. Default = 20
            """
            pageSize: Int = 20
            """
            Default = 0
            """
            offset: Int! = 0
        ): [Printer]! @auth(requires: WORKER) @isAuthenticated
    }

    type Mutation {
        """
        註冊帳號
        """
        signUp(userInfo: UserInput!): String
        """
        帳號登入並回傳token
        """
        login(userName: String!, password: String!): String
        """
        編輯帳號權限
        """
        setRoleByUserName(userName: String!, roles: [UserRole]!): User @auth(requires: ADMIN) @isAuthenticated
        insertACC(AccContent: ACCInput!): ACC @auth(requires: MANAGER) @isAuthenticated
        deleteACC(name: String!): String @auth(requires: MANAGER) @isAuthenticated
        """
        新增打印機
        """
        insertPrinter(printerInfo: PrinterInput!, file: Upload): String @auth(requires: MANAGER) @isAuthenticated
        setPrinter(printerInfo: setPrinterInput!, file: Upload): String @auth(requires: MANAGER) @isAuthenticated
        uploadFile(files: [Upload]!): [File]
    }

    type ACCConnection {
        cursor: String!
        hasMore: Boolean!
        accs: [ACC]!
    }
`
