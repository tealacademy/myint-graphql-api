import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, InterfaceType, ID, Int } from 'type-graphql'
import { Edge } from './edge.schema'
import { MyinTObjectOwner } from './myintobject.schema'
import { ParticipantGroup } from './group.schema'

@ObjectType({ description: 'The message model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Message extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: true })
  body: string
}

@ObjectType({ description: 'The edge between group and messages' })
@modelOptions({ options: { allowMixed: 0 } })
export class ChatGroupMessageEdge extends Edge {
  @Field(() => ParticipantGroup)
  @prop({ ref: () => ParticipantGroup })
  group: Ref<ParticipantGroup>

  @Field(() => Message)
  @prop({ ref: () => Message })
  message: Ref<Message>
}

export const MessageModel = getModelForClass<typeof Message>(Message, { schemaOptions: { timestamps: { createdAt: true } } })
export const ChatGroupMessageEdgeModel = getModelForClass<typeof ChatGroupMessageEdge>(ChatGroupMessageEdge, { schemaOptions: { timestamps: true } })

@InputType({ description: 'The type used for creating a new message' })
export class CreateMessageInput implements Partial<Message> {
  @Field(() => String)
  body: string

  @Field(() => String)
  group: string
}

@InterfaceType()
export abstract class IMessage {
  @Field(() => String)
  _id: string

  @Field(() => String)
  owner: string

  @Field(() => String)
  body: string

  @Field(() => String)
  group: string
}
