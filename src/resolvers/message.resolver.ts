import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreateTagInput, GetTagInput, Tag } from '../schema/tag.schema'
import TagService from '../service/tag.service'
import Context from '../types/context'

@Resolver()
export default class TagResolver {
  constructor(private tagService: TagService) {
    this.tagService = new TagService()
  }

  @Authorized()
  @Mutation(() => Tag)
  createTag(@Arg('input') input: CreateTagInput, @Ctx() context: Context) {
    // Create complete document with filled 1:n relations for tags, slides
    const user = context.user!
    return this.tagService.createTag({ ...input, owner: user._id })
  }

  @Authorized()
  @Query(() => [Tag])
  getTags(@Ctx() context: Context) {
    const user = context.user!
    return this.tagService.findUserTags(user._id)
  }

  // @Authorized()
  // @Query(() => Tag)
  // getSingleTag(@Arg('input') input: GetTagInput, @Ctx() context: Context) {
  //   const user = context.user!
  //   return this.tagService.findSingleTag({ title: input.title, owner: user._id })
  // }
}
