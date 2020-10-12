import { gql } from 'apollo-server'

export const userType = gql`
  enum UserRole {
      ADMIN
      MANAGER
      WORKER
  }
  
  type User {
      userName: String!
      token: String
      roles: [UserRole]!
  }
  
  input UserInput {
      userName: String!
      password: String!
      roles: [UserRole]! = [WORKER]
  }
  
`

export class User {
  constructor({ userName, token, roles }) {
    this.userName = userName
    this.token = token
    this.roles = roles
  }

  hasRole(role) {
    return this.roles.includes(role)
  }
}
