import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, InterfaceType, ID, Int } from 'type-graphql'
import { User } from './user.schema'
import { Group } from './group.schema'

@ObjectType({ description: 'The message model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Message {
  @Field((type) => ID)
  _id: string

  @Field(() => User) // Remove if field not publicly accessible?
  @prop({ required: true, ref: () => User })
  owner: Ref<User> // This is a reference to a user

  @Field(() => String)
  @prop({ required: true })
  body: string

  @Field(() => Group) // Remove if field not publicly accessible?
  @prop({ required: true, ref: () => Group })
  group: Ref<Group> // This is a reference to a user
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
