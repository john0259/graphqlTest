import { gql } from 'apollo-server'

export const query = gql`
    type Query {
        ACCList(
            """
            The number of results ti show. Must be >= 1. Default = 20
            """
            pageSize: Int
            after: String
        ): ACCConnection!
    }

    type Mutation {
        insertACC(AccContent: ACCInput!): ACC
        uploadFile(files: [Upload]!): [File]
    }

    type ACCConnection {
        cursor: String!
        hasMore: Boolean!
        accs: [ACC]!
    }
`
