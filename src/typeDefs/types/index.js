import { ACCType } from './ACCType'
import { gql } from 'apollo-server'

const utils = gql`
  type File {
      filename: String!
      mimetype: String!
      encoding: String!
  }
`

export const types = [ACCType, utils]
