import { getModelForClass, prop, pre, ReturnModelType, queryMethod, index } from '@typegoose/typegoose' // see https://typegoose.github.io/typegoose/
import { AsQueryMethod } from '@typegoose/typegoose/lib/types'
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator'
import { Field, InputType, ObjectType, ID } from 'type-graphql'

@ObjectType({ description: 'The user-profile model' }) // grapQL does not know this will be an object so we add @Object() (from type-graphql)
export class Profile {
  // These @Fields can be accessed with grapQL
  @Field((type) => ID)
  _id: string

  @Field(() => String)
  @prop({ required: true })
  firstName: string

  @Field(() => String)
  @prop({ required: false })
  lastName: string

  @Field(() => String)
  @prop({ required: false })
  address: string

  @Field(() => String)
  @prop({ required: false })
  houseNumber: string

  @Field(() => String)
  @prop({ required: false })
  zipCode: string

  @Field(() => String)
  @prop({ required: false })
  city: string

  @Field(() => String)
  @prop({ required: true })
  settings: string

  @prop({ required: true, nullable: true, default: null })
  deleted: Date
}

export const ProfileModel = getModelForClass<typeof Profile>(Profile, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new profile' })
export class CreateProfileInput implements Partial<Profile> {
  @Field(() => String)
  firstName: string

  @Field(() => String, { nullable: true })
  lastName: string

  @Field(() => String, { nullable: true })
  address: string

  @Field(() => String, { nullable: true })
  houseNumber: string

  @Field(() => String, { nullable: true })
  zipCode: string

  @Field(() => String, { nullable: true })
  city: string

  @Field(() => String, { nullable: true })
  settings: string

  // users?
}

@InputType({ description: 'The type used for getting a profile' })
export class GetProfileInput {
  @Field(() => String)
  profileId: string
}

// @InputType({ description: 'The type used for updating an existing profile' })
// export class UpdateProfileInput {
//   @Field(() => String)
//   userId?: string

//   @Field(() => String, { nullable: true })
//   firstname: string

//   @Field(() => String, { nullable: true })
//   lastname: string

//   @Field(() => String)
//   updateDocument: string
// }