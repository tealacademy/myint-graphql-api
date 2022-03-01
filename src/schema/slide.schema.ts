import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'

@ObjectType({ description: 'The slide model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Slide {
  @Field((type) => ID)
  _id: string

  @Field(() => [SlideObject], { nullable: true })
  @prop({ required: false })
  slideObjects?: SlideObject[]

  @Field(() => Boolean, { nullable: true })
  @prop({ required: false, default: true })
  show?: boolean

  @prop({ required: false })
  deleted?: Date
}

@ObjectType({ description: 'The slide-object model' })
class SlideObject {
  // In case of kind, the field data contains:
  // 1. text: textline
  // 2. picture: location
  // 3. url: url
  // 4. video: location
  @Field(() => String)
  @prop({ required: true })
  kind: string

  // 1: text
  // 2: png, jpg etc
  // 3: http, ftp
  // 4: youtube, vimeo, file etc.
  @Field(() => String)
  @prop({ required: true })
  kindType: string

  @Field(() => String, { nullable: true })
  @prop({ required: false })
  data?: string

  @Field(() => Int, { nullable: true })
  @prop({ required: false })
  xPos?: number

  @Field(() => Int, { nullable: true })
  @prop({ required: false })
  yPos?: number

  @Field(() => Boolean)
  @prop({ required: false, default: true })
  show?: boolean
}

export const SlideModel = getModelForClass<typeof Slide>(Slide, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new slide' })
export class CreateSlideInput {
  @Field()
  Id: string

  @Field(() => [ListSlideObjectInput], { nullable: true })
  slideObjects?: ListSlideObjectInput[]

  @Field(() => Boolean)
  show?: boolean
}

@InputType({ description: 'The type used for creating the slide-objects in a new slide' })
export class ListSlideObjectInput implements Partial<SlideObject> {
  @Field(() => String)
  kind: string

  @Field(() => String)
  kindType: string

  @Field(() => String, { nullable: true })
  data?: string

  @Field(() => Int, { nullable: true })
  xPos?: number

  @Field(() => Int, { nullable: true })
  yPos?: number

  @Field(() => Boolean)
  show?: boolean
}

@InputType({ description: 'The type used for getting a slide' })
export class GetSlideInput {
  @Field(() => String)
  Id: string
}
