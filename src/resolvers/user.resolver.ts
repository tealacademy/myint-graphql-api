import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreateUserInput, LoginInput, User } from '../schema/user.schema'
import UserService from '../service/user.service'
import Context from '../types/context'

// grapQL does not know this will be a resolver so we add @Resolver() (from type-graphql)
@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService()
  }

  @Mutation(() => User)
  registerUser(@Arg('input') input: CreateUserInput) {
    return this.userService.registerUser(input)
  }

  // @Mutation(() => User, { nullable: true })
  // confirmUser(@Arg('input') input: ConfirmUserInput) {
  //   return this.userService.confirmUser(input)
  // }

  @Query(() => String) // Returns the JWT
  login(@Arg('input') input: LoginInput, @Ctx() context: Context) {
    return this.userService.login(input, context)
  }

  @Query(() => User, { nullable: true }) // currently logged in user
  me(@Ctx() context: Context) {
    return context.user // https://www.youtube.com/watch?v=PXwnT25SZro does this differently
  }

  @Query(() => User, { nullable: true })
  logout(@Ctx() context: Context) {
    return this.userService.logout(context)
  }
}
