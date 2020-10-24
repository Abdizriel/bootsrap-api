import isNil from 'lodash/isNil'
import { AuthChecker } from 'type-graphql'

import { Context } from '@internalTypes/Context'

// create auth checker function
export const authChecker: AuthChecker<Context> = ({ context }) => {
  return !isNil(context.account)
}
