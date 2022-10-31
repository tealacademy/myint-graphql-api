import { getModelForClass, prop, Ref, modelOptions } from '@typegoose/typegoose' // see https://typegoose.github.io/typegoose/
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { User } from './user.schema'
import { Edge } from './edge.schema'
import { Role } from './role.schema'

@ObjectType({ description: 'The group model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Group {
  @Field((type) => ID)
  _id: string

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  owner: Ref<User> // This is a reference to the user who created the group

  @Field(() => String)
  @prop({ required: true })
  name: string

  @Field(() => String)
  @prop({ required: true })
  description: string

  @Field(() => [Role])
  @prop({ required: true, default: [], ref: () => Role })
  roles: Ref<Role>[]

  // through edges
  // @Field(() => [Group])
  // @prop({ required: false, ref: () => Group })
  // groups: Ref<Group>[]

  // @Field(() => [User])
  // @prop({ required: true, ref: () => User })
  // users: Ref<User>[] //

  @prop({ required: false })
  deleted?: Date
}

@ObjectType({ description: 'The edge between group and users' })
@modelOptions({ options: { allowMixed: 0 } })
export class GroupUserEdge extends Edge {
  @Field(() => Group)
  @prop({ required: true, ref: () => Group })
  group: Ref<Group>

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  user: Ref<User>
}

export const GroupModel = getModelForClass<typeof Group>(Group, { schemaOptions: { timestamps: true } })
export const GroupUserEdgeModel = getModelForClass<typeof GroupUserEdge>(GroupUserEdge, { schemaOptions: { timestamps: true } })

@InputType({ description: 'The type used for creating a new group' })
export class CreateGroupInput {
  @Field(() => String)
  name: string

  @Field(() => String)
  description: string

  @Field(() => [String])
  roles?: string[]
}

@InputType({ description: 'The type used for getting a group' })
export class GetGroupInput {
  @Field(() => String)
  id: string
}
