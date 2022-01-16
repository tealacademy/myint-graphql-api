import { AuthChecker } from 'type-graphql'
import Context from '../types/context'

const authChecker: AuthChecker<Context> = ({ context }) => {
  // if user exists, return true, otherwise false
  return !!context.user
}

export default authChecker
