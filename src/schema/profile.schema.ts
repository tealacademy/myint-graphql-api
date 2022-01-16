import { getModelForClass, prop, pre, ReturnModelType, queryMethod, index } from '@typegoose/typegoose' // see https://typegoose.github.io/typegoose/
import { AsQueryMethod } from '@typegoose/typegoose/lib/types'
import { IsEmail, MaxLength, MinLength } from 'class-validator'
import { Field, InputType, ObjectType, ID } from 'type-graphql'

@ObjectType({ description: 'The user-profile model' }) // grapQL does not know this will be an object so we add @Object() (from type-graphql)
export class Profile {
  // These @Fields can be accessed with grapQL
  @Field((type) => ID)
  _id: string

  @Field(() => String)
  @prop({ required: true })
  firstname: string

  @Field(() => String)
  @prop({ required: false })
  lastname: string

  @Field(() => String)
  @prop({ required: false })
  address: string

  @Field(() => String)
  @prop({ required: false })
  housenumber: string

  @Field(() => String)
  @prop({ required: false })
  zipcode: string

  @Field(() => String)
  @prop({ required: false })
  city: string
}

export const ProfileModel = getModelForClass<typeof Profile>(Profile, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new profile' })
export class CreateProfileInput {
  @Field(() => String)
  firstname: string

  @Field(() => String)
  lastname: string

  @Field(() => String)
  address: string

  @Field(() => String)
  housenumber: string

  @Field(() => String)
  zipcode: string

  @Field(() => String)
  city: string
}

@InputType({ description: 'The type used for creating a new profile' })
export class GetProfileInput {
  @Field(() => String)
  firstname: string

  @Field(() => String)
  lastname: string

  @Field(() => String)
  address: string

  @Field(() => String)
  housenumber: string

  @Field(() => String)
  zipcode: string

  @Field(() => String)
  city: string
}
