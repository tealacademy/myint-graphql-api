import { getModelForClass, modelOptions, index, Prop, prop, Ref } from "@typegoose/typegoose"
import { Field, InputType, ObjectType, ID, Int } from "type-graphql"
import { customAlphabet } from "nanoid"
import { User } from "./user.schema"
import { IsNumber, MaxLength, Min, MinLength } from "class-validator"
import Context from "../types/context"

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10)

@ObjectType({ description: "The slide model" })
@modelOptions({options: {allowMixed: 0}}) 
export class Slide {
   @Field(type => ID)
   _id: string

  // THe index of the slide in the array of slides of the Piece
  @Field(() => Int)
  @prop({ required: true })
  index: number

  @Field(() => [SlideObject])
  @prop({ required: false })
  slideObjects: SlideObject[]

  @Field(() => Boolean)
  @prop({ required: false })
  show: boolean
}

@ObjectType({ description: "The slide-object model" })
class SlideObject {
  @Field(() => String)
  @prop({ required: true })
  kind: string

  @Field(() => String)
  @prop({ required: false })
  textLine: string

  @Field(() => String)
  @prop({ required: false })
  location: string

  @Field(() => Int)
  @prop({ required: false })
  xPos: number

  @Field(() => Int)
  @prop({ required: false })
  yPos: number
}

export const ThemeModel = getModelForClass<typeof Slide>(Slide)

// @InputType({ description: "The type used for creating a new slide" })
// export class CreateSlideInput {

//   @Field(() => Int)
//   index: number

//   @Field(() => ListSlideObjectInput)
//   slideObjects: ListSlideObjectInput[]

//   @Field(() => Boolean)
//   show: boolean
// }

@InputType({ description: "The type used for creating a new slide" })
export class ListSlideInput {

  @Field(() => Int)
  index: number

  @Field(() => [ListSlideObjectInput])
  slideObjects: ListSlideObjectInput[]

  @Field(() => Boolean)
  show: boolean
}

@InputType({ description: "The type used for creating the slide-objects in a new slide" })
export class ListSlideObjectInput {
  @Field(() => String)
  kind: string

  @Field(() => String, { nullable: true })
  textLine: string

  @Field(() => Int, { nullable: true })
  xPos: number

  @Field(() => Int, { nullable: true })
  yPos: number

  @Field(() => String, { nullable: true })
  location: string
}

@InputType({ description: "The type used for getting a slide" })
export class GetSlideInput {
  @Field()
  slideId: string
}
