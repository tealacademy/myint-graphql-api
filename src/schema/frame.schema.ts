import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { Tag, CreateTagInput } from './tag.schema'
import { User } from './user.schema'
import { Edge, VersionEdge } from './edge.schema'
import { Challenge, ListChallengeInput } from './challenge.schema'
import { Clue, CreateClueInput } from './clue.schema'
import { Field, InputType, ObjectType, ID, Int, createUnionType } from 'type-graphql'

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

  // @Field(() => Challenge, { nullable: true }) // A frame has 0 or 1 challenge
  // @prop({ required: false, ref: () => Challenge })
  // challenge?: Ref<Challenge>

  // @Field(() => [Clue], { nullable: true })
  // @prop({ required: false })
  // clues?: Clue[]

  // The tags associated with this frame. No ref because of performance: necessary in UI
  // No edge because keeping track of creation of relation not important
  @Field(() => [Tag])
  @prop({ required: true })
  tags: Tag[]

  @Field(() => String, { nullable: true })
  @prop({ required: false })
  conclusion?: string

  @Field(() => Boolean)
  @prop({ required: true, default: false })
  starred: boolean

  @Field(() => String)
  @prop({ required: true, nullable: true })
  settings: string

  // DRAFT/UNANSWERED/ANSWERED/DELETED/SAVING
  @Field(() => String)
  @prop({ required: true })
  status: string

  @Field(() => Int)
  @prop({ required: true })
  version: number

  @Field(() => Boolean)
  @prop({ required: true, defaultValue: false })
  updateWithOriginal: boolean

  @prop({ required: false })
  deleted?: Date
}

@ObjectType({ description: 'The edge between frame and clues' })
@modelOptions({ options: { allowMixed: 0 } })
export class FrameClueEdge extends Edge {
  @Field(() => Frame)
  @prop({ required: true, ref: () => Frame })
  frame: Ref<Frame>

  @Field(() => Clue)
  @prop({ required: true, ref: () => Clue })
  clue: Ref<Clue>

  @Field(() => Number)
  @prop({ required: true })
  order: number
}

@ObjectType({ description: 'The edge for changes on a clue' })
@modelOptions({ options: { allowMixed: 0 } })
export class FrameVersionEdge extends VersionEdge {
  // Original frame
  @Field(() => Frame)
  @prop({ required: true, ref: () => Frame })
  frameOld: Ref<Frame>

  // Copy or original frame
  @Field(() => Frame)
  @prop({ required: true, ref: () => Frame })
  frameNew: Ref<Frame>
}

// @ObjectType({ description: 'The edge between frame and tags' })
// export class FrameTagEdge extends Edge {
//   @Field(() => Frame)
//   @prop({ required: true, ref: () => Frame })
//   frame: Ref<Frame>

//   @Field(() => Tag)
//   @prop({ required: true, ref: () => Tag })
//   tag: Ref<Tag>
// }

export const FrameModel = getModelForClass<typeof Frame>(Frame, { schemaOptions: { timestamps: { createdAt: true, updatedAt: true } } })
export const FrameClueEdgeModel = getModelForClass<typeof FrameClueEdge>(FrameClueEdge, { schemaOptions: { timestamps: { createdAt: true } } })
export const FrameVersionEdgeModel = getModelForClass<typeof FrameVersionEdge>(FrameVersionEdge, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new frame' })
export class CreateFrameInput {
  @Field(() => String)
  title: string

  @Field(() => String)
  owner: string

  @Field(() => ListChallengeInput, { nullable: true })
  challenge?: ListChallengeInput

  @Field(() => [CreateClueInput])
  clues?: CreateClueInput[]

  @Field(() => [CreateTagInput])
  tags: CreateTagInput[]

  @Field(() => String, { nullable: true })
  conclusion?: string

  @Field(() => Boolean, { defaultValue: false })
  starred: boolean

  @Field(() => String)
  settings: string

  @Field(() => Boolean)
  updateWithOriginal: boolean

  @Field(() => String)
  status: string

  @Field(() => Int)
  version: number
}

@InputType({ description: 'The type used for adding a frame' })
export class ListFrameInput {
  @Field()
  Id: string
}

@InputType({ description: 'The type used for getting a frame' })
export class GetFrameInput {
  @Field()
  Id: string
}
