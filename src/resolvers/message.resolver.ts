import { PubSubEngine, PubSub } from 'type-graphql'
import { Arg, Args, Root, Authorized, Ctx, Mutation, Query, Resolver, Subscription } from 'type-graphql'
import { CreateMessageInput, Message, IMessage } from '../schema/message.schema'
import MessageService from '../service/message.service'
import Context from '../types/context'
import { SUBSCRIPTIONS } from '../types/data'

@Resolver()
export default class MessageResolver {
  constructor(private messageService: MessageService) {
    this.messageService = new MessageService()
  }

  @Authorized()
  @Mutation(() => Message)
  createMessage(@PubSub() pubSub: PubSubEngine, @Arg('input') input: CreateMessageInput, @Ctx() context: Context) {
    // Create complete document with filled 1:n relations for messages, slides
    const user = context.user!
    return this.messageService.createMessage(pubSub, { ...input, owner: user._id })
  }

  @Authorized()
  @Query(() => [Message])
  getMessages(@Ctx() context: Context) {
    const user = context.user!
    return this.messageService.findUserMessages(user._id)
  }

  // https://typegraphql.com/docs/subscriptions.html
  @Subscription({
    topics: SUBSCRIPTIONS.MESSAGES,
  })
  newMessageSubscription(
    @Root() message: IMessage,
    // @Args() args: NewNotificationsArgs,
    @Ctx() context: Context
  ) {
    const user = context.user!

    return this.messageService.newMessage({ ...message, user: user._id })
  }
}
