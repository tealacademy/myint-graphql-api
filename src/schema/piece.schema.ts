import { getModelForClass, index, modelOptions, Prop, prop, Ref, Severity } from "@typegoose/typegoose"
import { Field, InputType, ObjectType, ID, Int } from "type-graphql"
import { customAlphabet } from "nanoid"
import { User } from "./user.schema"
import { Slide, ListSlideInput } from "./slide.schema"
import { Theme } from "./theme.schema"
import { Tag, CreateTagInput } from "./tag.schema"
import { IsNumber, MaxLength, Min, MinLength, IsUrl, IsArray, ValidateNested, IsObject } from "class-validator"
import Context from "./../types/context"

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10)

@ObjectType({ description: "The piece model" })
// @index({ index: 1 })
@modelOptions({options: {allowMixed: 0}})   // https://typegoose.github.io/typegoose/docs/api/decorators/model-options/#allowmixed
export class Piece {
  @Field(type => ID)
  _id: string

  // @Field(() => String)                      // Remove if field not publicly accessible?
  // @prop({ required: true, ref: () => User })
  // owner: Ref<User>                          // This is a reference to a user


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

  @Field(() => String)
  @prop({ required: true , ref: () => Theme })
  theme: Ref<Theme>
}

export const PieceModel = getModelForClass<typeof Piece>(Piece, { schemaOptions: { timestamps: { createdAt: true }}})

@InputType({ description: "The type used for creating a new piece" })
export class CreatePieceInput {
  @Field()
  title: string

  @Field()
  deepMyint: string

  @Field(() => [CreateTagInput]) 
  tags: CreateTagInput[]

  @Field(() => [ListSlideInput])
  slides: ListSlideInput[]

  @Field(() => String)
  theme: string

  // @MinLength(50, {
  //   message: "Description must be at least 50 characters",
  // })
  // @MaxLength(1000, {
  //   message: "Description must not be more than 1000 characters",
  // })
  // @Field()
  // deepMyint: string
}

@InputType({ description: "The type used for getting a piece" })
export class GetPieceInput {
  @Field()
  pieceId: string
}
