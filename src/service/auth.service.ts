import { AuthChecker } from 'type-graphql'
import Context from '../types/context'
import { verifyJwt } from '../utils/jwt'
import { User } from '../schema/user.schema'
import { UserModel } from '../schema/user.schema'

/**
 *
 */
class AuthService {
  /**
   *
   */
  authChecker: AuthChecker<Context> = ({ context }) => {
    return !!context.user
  }

  /**
   * We check if DB is initialised with necessary data.
   * If not present, we create this data
   */
  async initialiseDB() {
    // Check if user 'admin', 'administratorsgroup' and 'adminrole' exist in database
    const admin = await UserModel.find({})
    // if not, create?

    // Check if default theme exists

    // if not, create

    return true
  }

  /**
   * When we initialise the database for the first time, we do not yet have an admin-user to do that.
   * We then use a verificationcode to check if request from client is legit
   * This function checks this code
   * @param code
   * @returns
   */
  async checkInitCode(code: String) {
    // ! very simple for now. Probably better solution available

    return code === process.env.ADMIN_INIT_CODE
  }

  async verifyUser(ctx: Context) {
    const context = ctx

    const authHeader = ctx.req.get('Authorization')
    if (authHeader) {
      const token = authHeader.split(' ')[1]

      if (token) {
        // console.log('verifyJWT')
        const user = verifyJwt<User>(token)

        context.user = user // As soon as user is put in the context, @Authorised will validate in resolver
      }
    }
    // console.log(context)
    return context
  }
}

// export const authChecker: AuthChecker<Context> = ({ context }) => {
//   // if user exists, return true, otherwise false
//   return !!context.user
// }

export default AuthService
