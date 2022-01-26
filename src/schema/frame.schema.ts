import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Tag } from './tag.schema'
import { Piece } from './piece.schema'
import { User } from './user.schema'
import { Clue, ListClueInput } from './clue.schema'
import { Field, InputType, ObjectType, ID, Int, createUnionType } from 'type-graphql'

export const cluePiecesFramesList = createUnionType({
  name: 'CluePiecesFrames', // the name of the GraphQL union
  types: () => [Piece, Frame] as const, // function that returns tuple of object types classes
})

@ObjectType({ description: 'The frame model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Frame {
  @Field((type) => ID)
  _id: string

  @Field(() => User) // Remove if field not publicly accessible?
  @prop({ required: true, ref: () => User })
  owner: Ref<User> // This is a reference to a user

  @Field(() => String)
  @prop({ required: true })
  title: string

  @Field(() => Challenge)
  @prop({ required: false })
  challenge: Challenge

  @Field(() => [Clue])
  @prop({ required: false })
  clues: Clue[]

  // The tags associated with this frame.
  @Field(() => [Tag])
  @prop({ required: true, ref: () => Tag })
  tags: Ref<Tag>[]

  @Field(() => String)
  @prop({ required: false })
  conclusion: string

  @prop({ required: true, nullable: true, default: null })
  deleted: Date
}

@ObjectType({ description: 'The challenge-object model' })
class Challenge {
  @Field((type) => ID)
  _id: string

  @Field(() => User) // Remove if field not publicly accessible?
  @prop({ required: true, ref: () => User })
  owner: Ref<User> // This is a reference to a user

  @Field(() => String)
  @prop({ required: true })
  question: string

  @Field(() => String)
  @prop({ required: false })
  narrative: string

  @Field(() => [Frame])
  @prop({ required: false })
  frames: Frame[]
}

export const ChallengeModel = getModelForClass<typeof Challenge>(Challenge, { schemaOptions: { timestamps: { createdAt: true } } })
export const FrameModel = getModelForClass<typeof Frame>(Frame, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new frame' })
export class CreateFrameInput {
  @Field(() => String)
  title: string

  @Field(() => Challenge)
  challenge: Challenge

  @Field(() => [ListClueInput])
  clues: ListClueInput[]

  @Field(() => Tag)
  tags: Ref<Tag>
}

@InputType({ description: 'The type used for creating a new frame' })
export class ListFrameInput implements Partial<Frame> {
  @Field()
  frameId: string

  @Field(() => Int)
  index: number

  @Field(() => [ListClueInput])
  clues: Clue[]

  @Field(() => Boolean)
  show: boolean
}

@InputType({ description: 'The type used for getting a frame' })
export class GetFrameInput {
  @Field()
  frameId: string
}
