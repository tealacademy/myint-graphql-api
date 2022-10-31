import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, InterfaceType, ID, Int } from 'type-graphql'
import { User } from './user.schema'
import { Group } from './group.schema'

@ObjectType({ description: 'The message model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Message {
  @Field((type) => ID)
  _id: string

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  owner: Ref<User> // This is a reference to user who created the message

  @Field(() => Group)
  @prop({ required: true, ref: () => Group })
  group: Ref<Group> // This is a reference to group message was sent to

  @Field(() => String)
  @prop({ required: true })
  body: string
}

export const MessageModel = getModelForClass<typeof Message>(Message, { schemaOptions: { timestamps: { createdAt: true } } })

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
