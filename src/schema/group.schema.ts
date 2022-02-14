import { getModelForClass, prop, pre, ReturnModelType, queryMethod, Ref, index } from '@typegoose/typegoose' // see https://typegoose.github.io/typegoose/
import { AsQueryMethod } from '@typegoose/typegoose/lib/types'
import bcrypt from 'bcrypt'
import { IsEmail, MaxLength, MinLength } from 'class-validator'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { User } from './user.schema'

@ObjectType({ description: 'The group model' })
export class Group {
  @Field((type) => ID)
  _id: string

  // @Field(() => User) // Remove if field not publicly accessible?
  // @prop({ required: true, ref: () => User })
  // owner: Ref<User> // This is a reference to a user

  @Field(() => String)
  @prop({ required: true })
  name: string

  @Field(() => [User])
  @prop({ required: true, ref: () => User })
  users: Ref<User>[] //

  @prop({ required: false })
  deleted?: Date
}
