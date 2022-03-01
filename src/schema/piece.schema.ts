import { getModelForClass, index, isRefType, isRefTypeArray, modelOptions, Prop, prop, Ref, Severity } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { customAlphabet } from 'nanoid'
import { User } from './user.schema'
import { Slide, CreateSlideInput } from './slide.schema'
import { Theme } from './theme.schema'
import { Tag, CreateTagInput } from './tag.schema'
import { IsNumber, MaxLength, Min, MinLength, IsUrl, IsArray, ValidateNested, IsObject } from 'class-validator'
import Context from './../types/context'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz123456789', 10)

@ObjectType({ description: 'The piece model' })
// @index({ index: 1 })
@modelOptions({ options: { allowMixed: 0 } }) // https://typegoose.github.io/typegoose/docs/api/decorators/model-options/#allowmixed
export class Piece {
  @Field((type) => ID)
  _id: string

  @Field(() => User) // Remove if field not publicly accessible?
  @prop({ required: true, ref: () => User })
  owner: Ref<User> // This is a reference to a user

  @Field(() => String)
  @prop({ required: true })
  title: string

  @Field(() => String, { nullable: true })
  @prop({ required: false })
  deepMyinT?: string

  @Field(() => [Tag])
  @prop({ required: true })
  tags: Tag[]

  @Field(() => [Slide])
  @prop({ required: true })
  slides: Slide[]

  @Field(() => Theme, { nullable: true })
  @prop({ required: false, ref: () => Theme })
  theme?: Ref<Theme>

  @Field((type) => Int)
  @prop({ required: true })
  version: number

  @Field(() => Boolean, { nullable: true })
  @prop({ required: false, defaultValue: false })
  autoPlay?: boolean

  @Field(() => Boolean)
  @prop({ required: true, defaultValue: false })
  updateWithOriginal: boolean

  @prop({ required: false })
  deleted?: Date
}

export const PieceModel = getModelForClass<typeof Piece>(Piece, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new piece' })
export class CreatePieceInput {
  @Field(() => String)
  title: string

  @Field(() => String)
  owner: string

  @Field(() => String)
  deepMyinT?: string

  @Field(() => [CreateTagInput])
  tags: CreateTagInput[]

  @Field(() => [CreateSlideInput])
  slides: CreateSlideInput[]

  @Field(() => String)
  theme?: string

  @Field(() => Number)
  version: number

  @Field(() => Boolean)
  autoPlay?: boolean

  @Field(() => Boolean)
  updateWithOriginal: boolean
}

@InputType({ description: 'The type used for adding an existing piece to a list in another object' })
export class ListPieceInput {
  @Field(() => String)
  Id: string
}

@InputType({ description: 'The type used for getting a single piece' })
export class GetPieceInput {
  @Field(() => String)
  Id: string
}
