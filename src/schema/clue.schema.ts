import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { MyinTObjectOwner } from './myintobject.schema'
import { VersionEdge } from './edge.schema'
import { Piece } from './piece.schema'
import { Frame } from './frame.schema'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'

// export const cluePiecesFramesList = createUnionType({
//   name: 'CluePiecesFrames', // the name of the GraphQL union
//   types: () => [Piece, Frame] as const, // function that returns tuple of object types classes
// })

@ObjectType({ description: 'The clue-object model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Clue extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: true })
  question: string

  @Field(() => String, { nullable: true })
  @prop({ required: false })
  solution?: string

  /**
   * All objects that you need to solve the clue. In general pieces or frames (but also other Clues?)
   */
  @Field(() => [ObjReferenceList], { nullable: true })
  @prop({ required: false })
  objectList?: ObjReferenceList[]

  @Field(() => [Idea], { nullable: true })
  @prop({ required: false })
  ideas?: Idea[]

  @Field(() => Boolean)
  @prop({ default: false })
  complete: boolean

  @Field(() => Boolean)
  @prop({ default: true })
  show: boolean
}

/**
 *  We store this list as a list of Ref's to an Id
 *  and 'type' determines what type of object it is. (generally Piece or Frame)
 */
@ObjectType({ description: 'The objectReferences model (in general references to pieces or frames)' })
@modelOptions({ options: { allowMixed: 0 } })
export class ObjReferenceList {
  // https://typegraphql.com/docs/unions.html
  @Field(() => String)
  @prop({ required: true, items: ['Piece', 'Frame'] })
  type!: string

  @Field(() => String)
  @prop({ required: false, refPath: 'type' })
  Id: Ref<Piece | Frame>
}

/**
 * Every idea is unique so is a nested document
 */
@ObjectType({ description: 'The idea-object model' })
@modelOptions({ options: { allowMixed: 0 } })
class Idea extends MyinTObjectOwner {
  // Owner is a reference to the participant who added the Idea

  @Field(() => String)
  @prop({ required: true })
  description: string

  @Field(() => Int)
  @prop({ default: 0 })
  score: number

  @Field(() => Boolean)
  @prop({ default: 0 })
  selected: boolean // Idea added to the solution?

  /**
   * All objects that explain the Idea. In general pieces or frames
   * (but can also be other like Clues?)
   */
  @Field(() => [ObjReferenceList])
  @prop({ required: false })
  objectList?: ObjReferenceList[]
}

// @ObjectType({ description: 'The edge between challenge and frames' })
// @modelOptions({ options: { allowMixed: 0 } })
// export class ClueIdeaEdge extends Edge {
//   @Field(() => Clue)
//   @prop({ required: true, ref: () => Clue })
//   clue: Ref<Clue>

//   @Field(() => Idea)
//   @prop({ required: true, ref: () => Idea })
//   idea: Ref<Idea>

//   @Field(() => Number)
//   @prop({ required: true })
//   order: number
// }

@ObjectType({ description: 'The edge for changes on a clue' })
@modelOptions({ options: { allowMixed: 0 } })
export class ClueVersionEdge extends VersionEdge {
  // Original clue
  @Field(() => Clue)
  @prop({ required: true, ref: () => Clue })
  clueOld: Ref<Clue>

  // Copy or original clue
  @Field(() => Clue)
  @prop({ required: true, ref: () => Clue })
  clueNew: Ref<Clue>
}

export const ClueModel = getModelForClass<typeof Clue>(Clue, { schemaOptions: { timestamps: { createdAt: true, updatedAt: true } } })
export const IdeaModel = getModelForClass<typeof Idea>(Idea, { schemaOptions: { timestamps: { createdAt: true } } })
// export const ClueIdeaEdgeModel = getModelForClass<typeof ClueIdeaEdge>(ClueIdeaEdge, { schemaOptions: { timestamps: { createdAt: true } } })
export const ClueVersionEdgeModel = getModelForClass<typeof ClueVersionEdge>(ClueVersionEdge, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new frame' })
export class CreateClueInput {
  @Field()
  Id: string

  @Field(() => String)
  question: string

  @Field(() => String, { nullable: true })
  solution?: string

  @Field(() => [ObjReferenceListInput], { nullable: true })
  objectList?: ObjReferenceListInput[]

  @Field(() => [CreateIdeaInput], { nullable: true })
  ideas?: CreateIdeaInput[]

  @Field(() => Boolean, { defaultValue: false })
  complete: boolean

  @Field(() => Boolean, { defaultValue: true })
  show: boolean
}

@InputType({ description: 'The type used for creating a new frame' })
export class CreateIdeaInput {
  @Field(() => String)
  owner: string

  @Field(() => String)
  description: string

  @Field(() => [ObjReferenceListInput], { nullable: true })
  objectList?: ObjReferenceListInput[]
}

@InputType({ description: 'The type to input a piece or a frame' })
export class ObjReferenceListInput {
  @Field(() => String)
  type: string

  @Field(() => String)
  Id: string
}

@InputType({ description: 'The type used for getting a frame' })
export class GetClueInput {
  @Field()
  Id: string
}
