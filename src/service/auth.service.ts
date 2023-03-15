import { AuthChecker } from 'type-graphql'
import { verifyJwt } from '../utils/jwt'
import { Context, contextUser } from '../types/context'
import { UserModel } from '../schema/user.schema'

/**
 *
 */
class AuthService {
  /**
   *
   */
  authChecker: AuthChecker<Context> = ({ context }) => {
    // check on roles and groups

    return !!context.user
  }

  // ! FROM https://typegraphql.com/docs/authorization.html
  customAuthChecker: AuthChecker<Context> = ({ root, args, context, info }, roles) => {
    // here we can read the user from context
    // and check his permission in the db against the `roles` argument
    // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

    return true // or false if access is denied
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

  /**
   *
   * @param ctx
   * @returns
   */
  async verifyUser(ctx: Context) {
    const context = ctx

    const authHeader = ctx.req.get('Authorization')
    if (authHeader) {
      const token = authHeader.split(' ')[1]

      if (token) {
        // console.log('verifyJWT')
        const user = verifyJwt<contextUser>(token)

        context.user = user // As soon as user is put in the context, @Authorised will validate in resolver

        // add roles to user-object.
      }
    }

    return context
  }
}

export default AuthService

// export const authChecker: AuthChecker<Context> = ({ context }) => {
//   // if user exists, return true, otherwise false
//   return !!context.user
// }

// example auth checker function
// export const authChecker: AuthChecker<Context> = ({ context: { user } }, roles) => {
//   if (roles.length === 0) {
//     // if `@Authorized()`, check only if user exists
//     return user !== undefined;
//   }
//   // there are some roles defined now

//   if (!user) {
//     // and if no user, restrict access
//     return false;
//   }
//   if (user.roles.some(role => roles.includes(role))) {
//     // grant access if the roles overlap
//     return true;
//   }

//   // no roles matched, restrict access
//   return false;
// };
