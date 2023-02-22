import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Tag, CreateTagInput } from './tag.schema'
import { Frame, ListFrameInput } from './frame.schema'
import { Edge, VersionEdge } from './edge.schema'
import { MyinTObjectOwner } from './myintobject.schema'
import { MyinTSet, CreateMyinTSetInput } from './myintset.schema'
import { Field, InputType, ObjectType, ID } from 'type-graphql'

@ObjectType({ description: 'The challenge-object model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Challenge extends MyinTObjectOwner {
  @Field(() => String, { nullable: true })
  @prop({ required: false })
  name?: string

  @Field(() => String)
  @prop({ required: true })
  question: string

  @Field(() => String, { nullable: true })
  @prop({ required: false })
  narrative?: string

  // The tags associated with this challenge. No ref because of performance: necessary in UI
  // No edge because creation of relation not important
  @Field(() => [Tag]) // a challenge has 0..n tags
  @prop({ required: true, default: [] })
  tags: Tag[]

  // Also edge because you can change myinTSet. When changed a new MyinTSet should be created
  // Actual MyinTset stored here for performance
  @Field(() => MyinTSet, { nullable: true }) // When there is no specific MyinTSet, the Challenge is using the whole MyinT
  @prop({ required: false, ref: () => MyinTSet })
  myinTSet?: Ref<MyinTSet>

  // Also edges
  // Actual Frames also stored here for performance
  @Field(() => [Frame]) // a challenge has 0..n frames
  @prop({ required: true, default: [], ref: 'Frame' })
  frames: Ref<Frame>[]

  @Field(() => String)
  settings: string
}

@ObjectType({ description: 'The edge between challenge and frames' })
export class ChallengeFrameEdge extends Edge {
  @Field(() => Challenge)
  @prop({ required: true, ref: () => Challenge })
  challenge: Ref<Challenge>

  @Field(() => Frame)
  @prop({ required: true, ref: 'Frame' })
  frame: Ref<Frame>

  @Field(() => Number)
  @prop({ required: true })
  order: number
}

@ObjectType({ description: 'The edge between challenge and frames' })
export class ChallengeMyinTSetEdge extends Edge {
  @Field(() => Challenge)
  @prop({ required: true, ref: () => Challenge })
  challenge: Ref<Challenge>

  @Field(() => MyinTSet)
  @prop({ required: true, ref: () => MyinTSet })
  frame: Ref<MyinTSet>
}

@ObjectType({ description: 'The edge for changes on a challenge' })
export class ChallengeVersionEdge extends VersionEdge {
  // Original challenge
  @Field(() => Challenge)
  @prop({ required: true, ref: () => Challenge })
  challengeOld: Ref<Challenge>

  // Copy or original challenge
  @Field(() => Challenge)
  @prop({ required: true, ref: () => Challenge })
  challengeNew: Ref<Challenge>
}

export const ChallengeModel = getModelForClass<typeof Challenge>(Challenge, { schemaOptions: { timestamps: { createdAt: true } } })
export const ChallengeFrameEdgeModel = getModelForClass<typeof ChallengeFrameEdge>(ChallengeFrameEdge, { schemaOptions: { timestamps: { createdAt: true } } })
export const ChallengeMyinTSetEdgeModel = getModelForClass<typeof ChallengeMyinTSetEdge>(ChallengeMyinTSetEdge, {
  schemaOptions: { timestamps: { createdAt: true } },
})
export const ChallengeVersionEdgeModel = getModelForClass<typeof ChallengeVersionEdge>(ChallengeVersionEdge, {
  schemaOptions: { timestamps: { createdAt: true } },
})

@InputType({ description: 'The type used for creating a new frame' })
export class CreateChallengeInput {
  @Field(() => String, { defaultValue: '' })
  Id: string

  @Field(() => String) // Remove if field not publicly accessible?
  owner: string // This is a reference to a user

  @Field(() => String)
  question: string

  @Field(() => String, { nullable: true })
  narrative?: string

  @Field(() => [CreateTagInput])
  tags: CreateTagInput[]

  @Field(() => CreateMyinTSetInput, { nullable: true })
  myinTSet?: CreateMyinTSetInput

  @Field(() => [ListFrameInput]) // a challenge has 0..n frames
  frames: ListFrameInput[]

  @Field(() => String)
  settings: string
}

@InputType({ description: 'The type used for adding a challenge' })
export class ListChallengeInput {
  @Field()
  Id: string
}
@InputType({ description: 'The type used for getting a challenge' })
export class GetChallengeInput {
  @Field()
  Id: string
}

@InputType({ description: 'The type used for getting a list of frames' })
export class ListRefFrame {
  @Field(() => Frame)
  frame: Ref<Frame>
}
