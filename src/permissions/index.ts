import { shield, and } from 'graphql-shield'
import * as rules from './rules'

export const permissions = shield({
  Query: {
    user: rules.isClient
  }
})