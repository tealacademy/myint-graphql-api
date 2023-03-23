import { getModelForClass, prop, pre, ReturnModelType, queryMethod, modelOptions, index, Ref } from '@typegoose/typegoose' // see https://typegoose.github.io/typegoose/
import { AsQueryMethod } from '@typegoose/typegoose/lib/types'
import bcrypt from 'bcrypt'
import { IsEmail, MaxLength, MinLength } from 'class-validator'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { Profile, CreateProfileInput } from './profile.schema'
import { Group } from './group.schema'
import { MyinTObject } from './myintobject.schema'
import { MyinTSet } from './myintset.schema'
import { Edge } from './edge.schema'

function findByEmail(this: ReturnModelType<typeof User, QueryHelpers>, email: User['eMail']) {
  return this.findOne({ email })
}

interface QueryHelpers {
  findByEmail: AsQueryMethod<typeof findByEmail>
}

// This runs pre-save
@pre<User>('save', async function () {
  // Check that the password is being modified, otherwise do not save
  if (!this.isModified('password')) {
    return
  }
  // encrypt the password
  const salt = await bcrypt.genSalt(10)
  const hash = bcrypt.hashSync(this.passWord, salt)
  this.passWord = hash
})
@index({ email: 1 })
@queryMethod(findByEmail) // We find users by email
@ObjectType({ description: 'The user model' }) // grapQL does not know this will be an object so we add @Object() (from type-graphql)
@modelOptions({ options: { allowMixed: 0 } })
export class User extends MyinTObject {
  @Field(() => String)
  @prop({ required: true, unique: true })
  eMail: string

  @prop({ required: true })
  passWord: string

  @Field(() => String)
  @prop({ required: true })
  confirmToken: string

  @Field(() => String)
  @prop({ required: true, nullable: true })
  settings: string

  // @Field(() => [Role])
  // @prop({ required: true, default: [], ref: () => Role })
  // roles: Ref<Role>[]

  // Relation through Edge
  // @Field(() => [Group])
  // @prop({ required: true, default: [], ref: () => Group })
  // groups: Ref<Group>[]

  @Field(() => Boolean)
  @prop({ required: true, default: false })
  active: boolean

  @Field(() => Profile)
  @prop({ required: true })
  profile: Ref<Profile>
}

@ObjectType({ description: 'Edge: to which group(s) belongs a user' })
export class UserGroupEdge extends Edge {
  @Field(() => User)
  @prop({ required: true, ref: () => User })
  user: Ref<User>

  @Field(() => Group)
  @prop({ required: true, ref: () => Group })
  group: Ref<Group>
}

/** UserOrganisationMyinTSetEdge
 * A Person can connect a MyinTSet-object of his MyinT to a User-Organisation relation (UserOrganisationMyinTSetEdge).
 * This way only a subset of the Persons MyinT will be available for other Users in this Organisation.
 */
@ObjectType({ description: 'Edge: which MyinTSet a User has/wants to have in a specific Organisation' })
export class UserOrganisationMyinTSetEdge extends Edge {
  @Field(() => User)
  @prop({ required: true, ref: () => User })
  user: Ref<User>

  @Field(() => Group)
  @prop({ required: true, ref: () => Group })
  group: Ref<Group>

  @Field(() => MyinTSet)
  @prop({ required: true, ref: () => MyinTSet })
  myinTSet: Ref<MyinTSet>
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User, { schemaOptions: { timestamps: true } })
export const UserGroupEdgeModel = getModelForClass<typeof UserGroupEdge, QueryHelpers>(UserGroupEdge, { schemaOptions: { timestamps: true } })
export const UserOrganisationMyinTSetEdgeModel = getModelForClass<typeof UserOrganisationMyinTSetEdge, QueryHelpers>(UserOrganisationMyinTSetEdge, {
  schemaOptions: { timestamps: true },
})
@InputType({ description: 'The type used for creating a new user' })
export class CreateUserInput {
  @IsEmail()
  @Field(() => String)
  eMail: string

  @MinLength(6, {
    message: 'password must be at least 6 characters long',
  })
  @MaxLength(50, {
    message: 'password can not be longer than 50 characters',
  })
  @Field(() => String)
  passWord: string

  @Field(() => String, { nullable: true }) // When no settings, user gets defaultSettings in frontend
  settings?: string

  //
  @Field(() => String)
  profile?: string
}

@InputType()
export class LoginInput {
  @Field(() => String)
  eMail: string

  @Field(() => String)
  passWord: string
}

@InputType()
export class AddUserGroupInput {
  @Field(() => String)
  Id: string

  @Field(() => String)
  groupId: string
}
