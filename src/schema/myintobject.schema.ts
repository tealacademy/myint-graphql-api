import { prop, Ref } from '@typegoose/typegoose'
import { Field, ObjectType, ID } from 'type-graphql'
import { User } from './user.schema'

/**
 * Relations in our database are made with edges between nodes.
 */
@ObjectType({ description: 'The basic myintobject model' })
export class MyinTObject {
  @Field((type) => ID)
  _id: string

  // This is a reference to the user who created the object. Can never be another
  @Field(() => User)
  @prop({ required: true, ref: () => User })
  owner: Ref<User>

  @prop({ required: false })
  deleted?: Date
}

@ObjectType({ description: 'The basic myintobject model' })
export class MyinTObjectOwner extends MyinTObject {
  // This is a reference to the user who created the object. Can never be another
  @Field(() => User)
  @prop({ required: true, ref: () => User })
  owner: Ref<User>
}
