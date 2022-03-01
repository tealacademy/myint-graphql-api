import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { User } from './user.schema'
import Context from '../types/context'

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
  title: string

  @prop({ required: false })
  deleted?: Date
}

export const MessageModel = getModelForClass<typeof Message>(Message, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new message' })
export class CreateMessageInput implements Partial<Message> {
  @Field(() => String, { defaultValue: '' })
  Id: string

  @Field(() => String)
  title: string

  @Field(() => String)
  owner: string
}

@InputType({ description: 'The type used for creating a new message' })
export class ListMessageInput {
  @Field(() => String)
  Id: string
}

@InputType({ description: 'The type used for getting a message' })
export class GetMessageInput {
  @Field(() => String)
  Id: string
}
