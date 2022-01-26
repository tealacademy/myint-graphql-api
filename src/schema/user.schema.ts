import { getModelForClass, prop, pre, ReturnModelType, queryMethod, index } from '@typegoose/typegoose' // see https://typegoose.github.io/typegoose/
import { AsQueryMethod } from '@typegoose/typegoose/lib/types'
import bcrypt from 'bcrypt'
import { IsEmail, MaxLength, MinLength } from 'class-validator'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { Profile, GetProfileInput } from './profile.schema'

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
export class User {
  // These @Fields can be accessed with grapQL
  @Field((type) => ID)
  _id: string

  @Field(() => String)
  @prop({ required: true, unique: true })
  eMail: string

  @prop({ required: true })
  passWord: string

  @Field(() => Profile)
  @prop({ required: true })
  profile: Profile

  @Field(() => String)
  @prop({ required: true })
  confirmToken: string

  @prop({ required: true, default: false })
  active: boolean

  @prop({ required: true, nullable: true, default: null })
  deleted: Date
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new user' })
export class CreateUserInput implements Partial<User> {
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

  @Field(() => GetProfileInput)
  profile: Profile
}

@InputType()
export class LoginInput {
  @Field(() => String)
  eMail: string

  @Field(() => String)
  passWord: string
}
