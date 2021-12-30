import { getModelForClass, modelOptions, index, Prop, prop, Ref } from "@typegoose/typegoose"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { Field, InputType, ObjectType, ID, Int } from "type-graphql"

@ObjectType({ description: "The slide model" })
@modelOptions({options: {allowMixed: 0}}) 
export class Slide {
   @Field(type => ID)
   _id: string

  // Tee index of the slide in the array of slides of the Piece
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

export const SlideModel = getModelForClass<typeof Slide>(Slide, { schemaOptions: { timestamps: { createdAt: true }}})

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
  @Field()
  slideID: string

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
