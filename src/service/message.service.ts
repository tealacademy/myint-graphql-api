import { CreateMessageInput, GetMessageInput, ListMessageInput, MessageModel, Message } from '../schema/message.schema'
import { User } from '../schema/user.schema'

class MessageService {
  async createMessage(input: CreateMessageInput & { owner: User['_id'] }) {
    // Create the message and link it to the current user

    const newMessage = await MessageModel.create(input)

    return newMessage
  }

  async findUserMessages(userId: string) {
    const messages = await MessageModel.find({ owner: userId }).lean()

    // console.log('messages', messages)
    return messages
  }

  async findSingleMessage(input: GetMessageInput & { owner: User['_id'] }) {
    // must be of owner, other searchfields optional
    return MessageModel.findOne({ ...input }).lean()
  }

  /** Creates messages that do not exist yet and adjusts the input */
  async handleMessageList(inputMessages: CreateMessageInput[], owner: User['_id']) {
    console.log('handleMessageList', inputMessages)

    const newMessages = []
    for (const message of inputMessages) {
      // If no ID, we need to create message
      const existingMessage = await this.findSingleMessage({ Id: message.Id, owner: owner })

      const newMessage = message.Id === '' || !existingMessage ? await this.createMessage({ ...message, owner: owner }) : existingMessage

      newMessages.push(newMessage)
    }
    return newMessages
  }
}

export default MessageService
