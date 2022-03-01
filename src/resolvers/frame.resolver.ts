import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreateFrameInput, GetFrameInput, Frame } from '../schema/frame.schema'
import FrameService from '../service/frame.service'
import Context from '../types/context'

@Resolver()
export default class FrameResolver {
  constructor(private frameService: FrameService) {
    this.frameService = new FrameService()
  }

  @Authorized() // uses AuthChecker (imported in schema in index.ts)
  @Mutation(() => Frame)
  createFrame(@Arg('input') input: CreateFrameInput, @Ctx() context: Context) {
    const user = context.user!

    return this.frameService.createFrame({ ...input, owner: user._id })
  }

  // @Authorized()
  @Query(() => [Frame])
  getFrames(@Ctx() context: Context) {
    const user = context.user!
    const userId = '61e1871699df55f4e68933d7'
    return this.frameService.findUserFrames(userId) //user._id)
  }

  @Authorized()
  @Query(() => Frame)
  frame(@Arg('input') input: GetFrameInput, @Ctx() context: Context) {
    const user = context.user!
    return this.frameService.findSingleFrame({ ...input, owner: user._id })
  }
}
