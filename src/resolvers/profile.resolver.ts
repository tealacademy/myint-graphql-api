import { Arg, Ctx, Authorized, Mutation, Query, Resolver } from 'type-graphql'
import { Profile } from '../schema/profile.schema'
// import { UpdateProfileInput, Profile } from '../schema/profile.schema'
import ProfileService from '../service/profile.service'

// grapQL does not know this will be a resolver so we add @Resolver() (from type-graphql)
@Resolver()
export default class ProfileResolver {
  constructor(private profileService: ProfileService) {
    this.profileService = new ProfileService()
  }

  //   @Authorized()
  //   @Mutation(() => Profile)
  //   updateProfile(@Arg('input') input: UpdateProfileInput) {
  //     return this.profileService.updateProfile(input)
  // }
}

// Zo kan het ook
// async updateProfile(
//     @Ctx() {payload}: MyContext,
//     @Arg('firstName', { nullable: true }) firstName: string,
//     @Arg('lastName', { nullable: true }) lastName: string,
//   )
