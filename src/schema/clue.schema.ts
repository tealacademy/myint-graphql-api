import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Tag, CreateTagInput } from './tag.schema'
import { Piece, ListPieceInput } from './piece.schema'
import { Frame, ListFrameInput } from './frame.schema'
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
  solution?: string

  // https://typegraphql.com/docs/unions.html
  @Field(() => [cluePiecesFramesList])
  @prop({ required: false })
  piecesFramesList: typeof cluePiecesFramesList[]

  @Field(() => Tag)
  @prop({ required: false })
  tag?: Tag

  @Field(() => [Idea])
  @prop({ required: false })
  ideas?: Idea[]

  @Field(() => Boolean)
  @prop({ default: false })
  complete: boolean

  @Field(() => Boolean)
  @prop({ default: true })
  show: boolean

  @Field(() => Int)
  @prop({ required: true })
  index: number

  @prop({ required: false })
  deleted?: Date
}

@ObjectType({ description: 'The idea-object model' })
@modelOptions({ options: { allowMixed: 0 } })
class Idea {
  @Field((type) => ID)
  _id: string

  @Field(() => User) // Remove if field not publicly accessible?
  @prop({ required: true, ref: () => User })
  owner: Ref<User> // This is a reference to a user

  @Field(() => String)
  @prop({ required: true })
  description: string

  @Field(() => Int)
  @prop({ default: 0 })
  score: number

  @Field(() => [cluePiecesFramesList])
  @prop({ required: false })
  piecesFramesList?: typeof cluePiecesFramesList[]
}

export const ClueModel = getModelForClass<typeof Clue>(Clue, { schemaOptions: { timestamps: { createdAt: true } } })
export const IdeaModel = getModelForClass<typeof Idea>(Idea, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new frame' })
export class CreateClueInput {
  @Field()
  Id: string

  @Field(() => String)
  question: string

  @Field(() => String, { nullable: true })
  solution: string

  // https://typegraphql.com/docs/unions.html
  @Field(() => [ListPieceFrameInput], { nullable: true })
  piecesFramesList: ListPieceFrameInput[]

  @Field(() => CreateTagInput, { nullable: true })
  tag: CreateTagInput

  @Field(() => [CreateIdeaInput], { nullable: true })
  ideas: CreateIdeaInput[]

  @Field(() => Boolean, { defaultValue: false })
  complete: boolean

  @Field(() => Boolean, { defaultValue: true })
  show: boolean

  @Field(() => Int)
  index: number
}

@InputType({ description: 'The type used for creating a new frame' })
export class CreateIdeaInput {
  @Field()
  Id: string

  @Field(() => String)
  owner: string

  @Field(() => String)
  description: string

  @Field(() => [ListPieceFrameInput])
  piecesFramesList: ListPieceFrameInput[]
}

@InputType({ description: 'The type to input a piece or a frame' })
export class ListPieceFrameInput {
  @Field(() => ListPieceInput, { nullable: true })
  piece?: ListPieceInput

  @Field(() => ListFrameInput, { nullable: true })
  frame?: ListFrameInput
}

@InputType({ description: 'The type used for getting a frame' })
export class GetClueInput {
  @Field()
  Id: string
}
