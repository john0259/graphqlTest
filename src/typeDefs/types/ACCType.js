import { gql } from 'apollo-server'

export const ACCType = gql`
  scalar JSONObject
  type ACC {
      name: String!
      content: ACCContent
  }
  
  type ACCContent {
      cover: Boolean!
      materials: [Material]!
      insertPage: [JSONObject]
      blankPDF: String
      paperWeight: Int
      printMode: String
      pageSize: Float
      sourceResize: [JSONObject]
      sourceRotate: [JSONObject]
      pageSlice: JSONObject
      dividePrint: Boolean
      coverSpec: JSONObject
      sourceNormalization: Boolean
      barcode: Boolean
      sourceShift: JSONObject
  }
  
  type Material {
      materialName: String!
      startPage: Int!
      endPage: Int!
  }

  input ACCInput {
      name: String!
      content: ACCContentInput
  }

  input ACCContentInput {
      cover: Boolean!
      materials: [MaterialInput]!
      insertPage: [JSONObject]
      blankPDF: String
      paperWeight: Int
      printMode: String
      pageSize: Float
      sourceResize: [JSONObject]
      sourceRotate: [JSONObject]
      pageSlice: JSONObject
      dividePrint: Boolean
      coverSpec: JSONObject
      sourceNormalization: Boolean
      barcode: Boolean
      sourceShift: JSONObject
  }

  input MaterialInput {
      materialName: String!
      startPage: Int!
      endPage: Int!
  }
`
