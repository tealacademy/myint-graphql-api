import { getModelForClass, prop, Ref, modelOptions } from '@typegoose/typegoose' // see https://typegoose.github.io/typegoose/
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { User } from './user.schema'
import { VersionEdge } from './edge.schema'
import { Role } from './role.schema'
import { Message } from './message.schema'
import { MyinTObjectOwner } from './myintobject.schema'

@ObjectType({ description: 'The group model' })
// @modelOptions({ options: { allowMixed: 0 } })
export class Group extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: true })
  name: string

  @Field(() => String)
  @prop({ required: true })
  description: string

  // @Field(() => [Role])
  // @prop({ required: true, default: [], ref: () => Role })
  // roles: Ref<Role>[]

  // through edges
  // @Field(() => [Group])
  // @prop({ required: false, ref: () => Group })
  // groups: Ref<Group>[]
}

@ObjectType({ description: 'Users and roles' })
export class UserRole {
  @Field(() => User)
  @prop({ required: true, ref: 'User' })
  users: Ref<User>

  @Field(() => Role)
  @prop({ required: true, default: null, ref: () => Role })
  role: Ref<Role>
}

/**
 * The usergroup has user(s) with their role(s) in this group
 * We use this when we want to grant rights to objects (For example a Piece or Frame (participants))
 */
// @ObjectType({ description: 'The group model with users and roles' })
// @modelOptions({ options: { allowMixed: 0 } })
// export class UserGroup extends Group {
//   @Field(() => [User])
//   @prop({ required: true, default: [], ref: 'User' })
//   users: Ref<User>[]

//   @Field(() => Role)
//   @prop({ required: true, default: [], ref: () => Role })
//   role: Ref<Role>
// }

/**
 * The participants-group has two userGroups with each only 1 role
 * for chat-group: in database-init we need to create default-roles for these two groups
 * for frames: we need to investigate which roles we need
 */
@ObjectType({ description: 'The participants group model with a Role per User' })
@modelOptions({ options: { allowMixed: 0 } })
export class ParticipantGroup extends Group {
  @Field(() => UserRole)
  @prop({ required: true, ref: () => UserRole })
  participants: Ref<UserRole>
}

/** */
// @ObjectType({ description: 'The edge for changes on a usergroup' })
// @modelOptions({ options: { allowMixed: 0 } })
// export class UserGroupVersionEdge extends VersionEdge {
//   // Original role
//   @Field(() => UserGroup)
//   @prop({ required: true, ref: () => UserGroup })
//   userGroupOld: Ref<UserGroup>

//   // Copy or original role
//   @Field(() => UserGroup)
//   @prop({ required: true, ref: () => UserGroup })
//   userGroupNew: Ref<UserGroup>
// }

@ObjectType({ description: 'The edge for changes on a clue' })
@modelOptions({ options: { allowMixed: 0 } })
export class ParticipantGroupVersionEdge extends VersionEdge {
  // Original role
  @Field(() => ParticipantGroup)
  @prop({ required: true, ref: () => ParticipantGroup })
  participantGroupOld: Ref<ParticipantGroup>

  // Copy or original role
  @Field(() => ParticipantGroup)
  @prop({ required: true, ref: () => ParticipantGroup })
  participantGroupNew: Ref<ParticipantGroup>
}

// export const UserGroupModel = getModelForClass<typeof UserGroup>(UserGroup, { schemaOptions: { timestamps: true } })
export const ParticipantGroupModel = getModelForClass<typeof ParticipantGroup>(ParticipantGroup, { schemaOptions: { timestamps: true } })
// export const UserGroupVersionEdgeModel = getModelForClass<typeof UserGroupVersionEdge>(UserGroupVersionEdge, { schemaOptions: { timestamps: true } })
export const ParticipantGroupVersionEdgeModel = getModelForClass<typeof ParticipantGroupVersionEdge>(ParticipantGroupVersionEdge, {
  schemaOptions: { timestamps: true },
})

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
