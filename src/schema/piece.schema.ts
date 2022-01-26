import { getModelForClass, index, isRefType, isRefTypeArray, modelOptions, Prop, prop, Ref, Severity } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { customAlphabet } from 'nanoid'
import { User } from './user.schema'
import { Slide, ListSlideInput } from './slide.schema'
import { Theme } from './theme.schema'
import { Tag, ListTagInput } from './tag.schema'
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

  @Field(() => String)
  @prop({ required: false })
  deepMyint: string

  @Field(() => [Tag])
  @prop({ required: true })
  tags: Tag[]

  @Field(() => [Slide])
  @prop({ required: true })
  slides: Slide[]

  @Field(() => Theme)
  @prop({ required: true })
  theme: Theme

  @Field((type) => Int)
  @prop({ required: true })
  version: number

  @prop({ required: true, nullable: true, default: null })
  deleted: Date
}

export const PieceModel = getModelForClass<typeof Piece>(Piece, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new piece' })
export class CreatePieceInput {
  @Field(() => String)
  title: string

  @Field(() => String)
  owner: string

  @Field(() => String)
  deepMyint: string

  @Field(() => [ListTagInput])
  tags: ListTagInput[]

  @Field(() => [ListSlideInput])
  slides: ListSlideInput[]

  @Field(() => String)
  theme: string

  @Field(() => Number)
  version: number
}

@InputType({ description: 'The type used for getting a piece' })
export class GetPieceInput {
  @Field(() => String)
  pieceId: string
}
