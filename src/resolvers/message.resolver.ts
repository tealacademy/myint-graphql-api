import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreateMessageInput, GetMessageInput, Message } from '../schema/message.schema'
import MessageService from '../service/message.service'
import Context from '../types/context'

@Resolver()
export default class MessageResolver {
  constructor(private messageService: MessageService) {
    this.messageService = new MessageService()
  }

  @Authorized()
  @Mutation(() => Message)
  createMessage(@Arg('input') input: CreateMessageInput, @Ctx() context: Context) {
    // Create complete document with filled 1:n relations for messages, slides
    const user = context.user!
    return this.messageService.createMessage({ ...input, owner: user._id })
  }

  @Authorized()
  @Query(() => [Message])
  getMessages(@Ctx() context: Context) {
    const user = context.user!
    return this.messageService.findUserMessages(user._id)
  }

  // @Authorized()
  // @Query(() => Message)
  // getSingleMessage(@Arg('input') input: GetMessageInput, @Ctx() context: Context) {
  //   const user = context.user!
  //   return this.messageService.findSingleMessage({ title: input.title, owner: user._id })
  // }
}
