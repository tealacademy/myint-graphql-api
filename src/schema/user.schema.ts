import { getModelForClass, prop, pre, ReturnModelType, queryMethod, modelOptions, index, Ref } from '@typegoose/typegoose' // see https://typegoose.github.io/typegoose/
import { AsQueryMethod } from '@typegoose/typegoose/lib/types'
import bcrypt from 'bcrypt'
import { IsEmail, MaxLength, MinLength } from 'class-validator'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { Profile, CreateProfileInput } from './profile.schema'
import { Group } from './group.schema'
import { MyinTObject } from './myintobject.schema'
import { Role } from './role.schema'
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

  // Relation through Edge
  // @Field(() => Profile)
  // @prop({ required: false, ref: () => Profile })
  // profile?: Ref<Profile>

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

  @prop({ required: true, default: false })
  active: boolean

  @prop(() => Profile)
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

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User, { schemaOptions: { timestamps: true } })
export const UserGroupEdgeModel = getModelForClass<typeof UserGroupEdge, QueryHelpers>(UserGroupEdge, { schemaOptions: { timestamps: true } })
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

  @Field(() => String)
  profile: string
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
