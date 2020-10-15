import { gql } from 'apollo-server'

export const printerType = gql`
  type Printer {
      name: String!
      nickname: String!
      ip:String!
      status: String!
      driverType: String!
      manufacturer: String!
      model: String!
      uri: String!
      trayInfo: [String]!
  }
  
  input PrinterInput {
      name: String!
      nickname: String!
      ip:String!
      driverType: String!
      manufacturer: String!
      model: String!
      uri: String!
      trayInfo: [String]!
  }
`
