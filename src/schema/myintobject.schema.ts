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

  @prop({ required: false })
  deleted?: Date
}

@ObjectType({ description: 'Basic myintobject model adding the owner of the object' })
export class MyinTObjectOwner extends MyinTObject {
  // This is a reference to the user who created the object. Can never be another
  @Field(() => User, { nullable: false })
  //@prop({ required: true, ref: () => User })
  // The 'Nested'(as string) form is useful to avoid unintuitive errors due to circular
  // dependencies, such as Option "ref" for "${name}.${key}" is null/undefined! [E005].
  @prop({ required: true, ref: 'User' })
  owner: Ref<User>
}
