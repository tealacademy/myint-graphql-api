import { Arg, Ctx, Authorized, Mutation, Query, Resolver } from 'type-graphql'
import { CreateUserInput, LoginInput, User } from '../schema/user.schema'
import { CreateProfileInput, Profile } from '../schema/profile.schema'
import UserService from '../service/user.service'
import ProfileService from '../service/profile.service'
import Context from '../types/context'

// grapQL does not know this will be a resolver so we add @Resolver() (from type-graphql)
@Resolver()
export default class UserResolver {
  constructor(private userService: UserService, private profileService: ProfileService) {
    this.userService = new UserService()
  }

  @Mutation(() => User)
  registerUserWithNewProfile(@Arg('input') inputUser: CreateUserInput, inputProfile: CreateProfileInput) {
    const user = this.userService.registerUserWithNewProfile(inputUser, inputProfile)
    return user
  }

  @Query(() => String) // Returns the JWT
  login(@Arg('input') input: LoginInput, @Ctx() context: Context) {
    return this.userService.login(input, context)
  }

  @Authorized()
  @Query(() => User, { nullable: true }) // currently logged in user
  me(@Ctx() context: Context) {
    console.log(context.user)
    return context.user // https://www.youtube.com/watch?v=PXwnT25SZro does this differently
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  logout(@Ctx() context: Context) {
    return this.userService.logout(context)
  }
}
