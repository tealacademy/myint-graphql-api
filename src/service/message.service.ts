import { PubSubEngine } from 'type-graphql'
import { ObjReferenceListInput } from '../schema/clue.schema'
import { CreateMessageInput, MessageModel, IMessage, Message } from '../schema/message.schema'
import { User } from '../schema/user.schema'
import UserService from './user.service'
import { SUBSCRIPTIONS } from '../types/data'

class MessageService {
  async createMessage(pubSub: PubSubEngine, input: CreateMessageInput & { owner: User['_id'] }) {
    // Create the message and link it to the current user

    const newMessage = await MessageModel.create(input)

    const payload: IMessage = { ...input, _id: newMessage._id }
    await pubSub.publish(SUBSCRIPTIONS.MESSAGES, payload)

    return newMessage
  }

  async findUserMessages(userId: string) {
    const messages = await MessageModel.find({ owner: userId }).lean()

    // console.log('messages', messages)
    return messages
  }

  /**  */
  async newMessage(input: IMessage & { user: User['_id'] }) {
    // there should be a check if user is in group message is sent to

    return (await new UserService().userInGroup(input.user, input.group)) ? { ...input, date: new Date() } : null
  }
}

export default MessageService
