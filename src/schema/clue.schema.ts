import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Tag } from './tag.schema'
import { Piece } from './piece.schema'
import { Frame } from './frame.schema'
import { User } from './user.schema'
import { Field, InputType, ObjectType, ID, Int, createUnionType } from 'type-graphql'

export const cluePiecesFramesList = createUnionType({
  name: 'CluePiecesFrames', // the name of the GraphQL union
  types: () => [Piece, Frame] as const, // function that returns tuple of object types classes
})

@ObjectType({ description: 'The clue-object model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Clue {
  @Field((type) => ID)
  _id: string

  @Field(() => String)
  @prop({ required: true })
  question: string

  @Field(() => String)
  @prop({ required: false })
  solution: string

  // https://typegraphql.com/docs/unions.html
  @Field(() => [cluePiecesFramesList])
  @prop({ required: false })
  piecesFramesList: typeof cluePiecesFramesList[]

  @Field(() => [Idea])
  @prop({ required: false })
  ideas: Idea[]

  @Field(() => Boolean)
  @prop({ default: false })
  complete: boolean
}

@ObjectType({ description: 'The idea-object model' })
class Idea {
  @Field((type) => ID)
  _id: string

  @Field(() => String) // Remove if field not publicly accessible?
  @prop({ required: true, ref: () => User })
  owner: Ref<User> // This is a reference to a user

  @Field(() => String)
  @prop({ required: true })
  description: string

  @Field(() => [cluePiecesFramesList])
  @prop({ required: false })
  piecesFramesList: typeof cluePiecesFramesList[]
}

export const ClueModel = getModelForClass<typeof Clue>(Clue, { schemaOptions: { timestamps: { createdAt: true } } })
export const IdeaModel = getModelForClass<typeof Idea>(Idea, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new frame' })
export class CreateClueInput implements Partial<Frame> {
  @Field()
  frameId: string

  @Field(() => Int)
  index: number

  @Field(() => [ListClueInput])
  clues: Clue[]

  @Field(() => Boolean)
  show: boolean
}

@InputType({ description: 'The type used for creating the frame-objects in a new frame' })
export class ListClueInput {
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

@InputType({ description: 'The type used for getting a frame' })
export class GetFrameInput {
  @Field()
  frameId: string
}
