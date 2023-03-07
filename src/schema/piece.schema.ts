import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, Int } from 'type-graphql'
import { customAlphabet } from 'nanoid'
import { MyinTObjectOwner } from './myintobject.schema'
import { Edge, VersionEdge } from './edge.schema'
import { Theme } from './theme.schema'
import { File } from './file.schema'
import { UserGroup } from './group.schema'
import { Tag, CreateTagInput } from './tag.schema'
import { Changeset } from './../utils/json-diff-ts/jsonDiff'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz123456789', 10)

/**
 * The newest version of a Piece of MyinT */
@ObjectType({ description: 'The piece model' })
// @index({ index: 1 })
@modelOptions({ options: { allowMixed: 0 } }) // https://typegoose.github.io/typegoose/docs/api/decorators/model-options/#allowmixed
export class Piece extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: true, defaultValue: '' })
  title: string

  @Field(() => Date, { nullable: true })
  @prop({ required: true })
  createdAtClient: Date

  @Field(() => String, { nullable: true })
  @prop({ required: false })
  deepMyinT?: string

  @Field(() => [Tag])
  @prop({ required: true, defaultValue: [] })
  tags: Tag[]

  @Field(() => [Slide])
  @prop({ required: true, defaultValue: [] })
  slides: Slide[]

  // If no theme set, default theme is used
  @Field(() => Theme, { nullable: true })
  @prop({ required: false, ref: () => Theme })
  theme?: Ref<Theme>

  // number of updates on this piece
  // API creates new versionnumber
  @Field((type) => Int)
  @prop({ required: true, defaultValue: 0 })
  updateVersion: number

  // ! th copy of piece
  // API creates versionnumber
  @Field((type) => Int)
  @prop({ required: true, immutable: true })
  pieceVersion: number

  @Field(() => Boolean, { nullable: true })
  @prop({ required: false, defaultValue: false })
  autoPlay?: boolean

  @Field(() => Boolean)
  @prop({ required: true, defaultValue: false })
  updateWithOriginal: boolean
}

/**
 * A slide is unique so there is no seperate doc for slides
 * it shows 1-n slideobjects on their x,y position
 *
 * slideobjects are:
 * - text
 * - extern file (via url)
 * - intern file (via s3)
 */
@ObjectType({ description: 'The slide model' })
// @modelOptions({ options: { allowMixed: 0 } })
export class Slide {
  @Field(() => String)
  key: string

  @Field(() => [SlideText], { nullable: true })
  @prop({ required: false })
  slideTexts?: SlideText[]

  @Field(() => [SlideLink], { nullable: true })
  @prop({ required: false })
  slideLinks?: SlideLink[]

  @Field(() => [SlideFile], { nullable: true })
  @prop({ required: false })
  slideFiles?: SlideFile[]

  @Field(() => Boolean, { nullable: true })
  @prop({ required: false, default: true })
  show?: boolean

  @prop({ required: false })
  deleted?: Date
}

/**
 * A slideobject has a x,y-position and can be made invisible
 */
@ObjectType({ description: 'The slide-object model' })
class SlideObject {
  @Field(() => String)
  key: string

  @Field(() => Int, { nullable: true })
  @prop({ required: true })
  xPos: number

  @Field(() => Int, { nullable: true })
  @prop({ required: true })
  yPos: number

  @Field(() => Boolean)
  @prop({ default: true })
  show: boolean
}

/**
 * Slidetext is just a line of text.
 * With Theme you can change visuals
 * Maybe we need some markup here
 */
@ObjectType({ description: 'The slide-object-text model' })
class SlideText extends SlideObject {
  @Field(() => String)
  @prop({ required: true })
  text: string
}

/**
 * SlideLink points to an external file.
 * Does Url need to be a seperate document?
 */
@ObjectType({ description: 'The slide-object-link model' })
class SlideLink extends SlideObject {
  // URL
  @Field(() => String)
  @prop({ required: true })
  url: string

  // youtube, vimeo, pdf, word etc. (to determine necessary viewer)
  @Field(() => String)
  @prop({ required: true })
  type: string
}

/**
 * SlideFile points to an internal file that is stored in own folder (S3-bucket)
 * File is seperate document in mongoDB because it is also index on our folder (S3-bucket)
 */
@ObjectType({ description: 'The slide-object-file model' })
class SlideFile extends SlideObject {
  @Field(() => File)
  @prop({ required: true, ref: () => File })
  file: Ref<File>
}

/**
 * PieceVersionEdge stores relation between old and new version of a Piece
 * It contains a delta of the two pieces so you can create the one Piece
 * with the other Piece. (We always store the newest version as a complete document of Piece)
 */
@ObjectType({ description: 'Edge: changes on a piece' })
@modelOptions({ options: { allowMixed: 0 } })
export class PieceVersionEdge extends VersionEdge {
  // Original piece
  @Field(() => Piece)
  @prop({ required: true, ref: () => Piece })
  oldPiece: Ref<Piece>

  // Copy of Piece or original piece
  @Field(() => Piece)
  @prop({ required: true, ref: () => Piece })
  newPiece: Ref<Piece>
}

/**
 * PieceGroupEdge stores relation between Pieces and groups who can
 * use this Piece. Roles (like editor, viewer etc) are stored in UserGroup
 */
@ObjectType({ description: 'Edge: which group(s) has the right to use a piece' })
@modelOptions({ options: { allowMixed: 0 } })
export class PieceGroupEdge extends Edge {
  // Original piece
  @Field(() => Piece)
  @prop({ required: true, ref: () => Piece })
  piece: Ref<Piece>

  // Copy or original piece
  @Field(() => UserGroup)
  @prop({ required: true, ref: () => UserGroup })
  group: Ref<UserGroup>
}

export const PieceModel = getModelForClass<typeof Piece>(Piece, { schemaOptions: { timestamps: { createdAt: true, updatedAt: true } } })
export const PieceVersionEdgeModel = getModelForClass<typeof PieceVersionEdge>(PieceVersionEdge, { schemaOptions: { timestamps: { createdAt: true } } })
export const PieceGroupEdgeModel = getModelForClass<typeof PieceGroupEdge>(PieceGroupEdge, { schemaOptions: { timestamps: { createdAt: true } } })

/** a new piece is always created by the user who calls the API */
@InputType({ description: 'The type used for creating a new piece' })
export class CreatePieceInput {
  @Field(() => String)
  title: string

  @Field(() => Date)
  createdAtClient: Date

  @Field(() => String)
  deepMyinT?: string

  @Field(() => [Tag])
  tags?: Tag[]

  @Field(() => [CreateSlideInput])
  slides?: CreateSlideInput[]

  // Ref (ID) to a theme
  @Field(() => String)
  theme?: string

  @Field(() => Boolean)
  autoPlay?: boolean

  @Field(() => Boolean)
  updateWithOriginal?: boolean
}

@InputType({ description: 'The type used for adding an existing piece to a list in another object' })
export class ListPieceInput {
  @Field(() => String)
  Id: string
}

@InputType({ description: 'The type used for getting a single piece' })
export class GetPieceInput {
  @Field(() => String)
  Id: string

  @Field(() => String)
  owner?: string

  @Field(() => Number)
  updateVersion?: number

  @Field(() => Number)
  pieceVersion?: number
}

@InputType({ description: 'The type used for getting a single piece' })
export class GetPieceListInput {
  @Field(() => String)
  Id: string

  @Field(() => String)
  owner?: string

  @Field(() => Number)
  updateVersion?: number

  @Field(() => Number)
  pieceVersion?: number
}

@InputType({ description: 'The type used for updating a single piece' })
export class UpdatePieceInput {
  @Field(() => String)
  Id: string

  @Field(() => String)
  delta: Changeset

  // give version on client-side to verify if it is the latest version
  // that is being update
  @Field(() => Number)
  currentVersion: number
}

@InputType({ description: 'The type used for updating a single piece' })
export class ReleasePieceInput {
  @Field(() => String)
  Id: string

  @Field(() => Date)
  createdAtClient: Date

  @Field(() => String)
  delta: Changeset

  // give version on client-side to verify if it is the latest version
  // that is being update
  @Field(() => Number)
  currentVersion: number
}

@InputType({ description: 'The type used for creating a new slide' })
export class CreateSlideInput {
  @Field(() => String)
  key: string

  @Field(() => [ListSlideObjectInput], { nullable: true })
  slideObjects?: ListSlideObjectInput[]

  @Field(() => Boolean)
  show?: boolean
}

@InputType({ description: 'The type used for creating the slide-objects in a new slide' })
export class ListSlideObjectInput implements Partial<SlideObject> {
  @Field(() => String)
  key: string

  @Field(() => Int, { nullable: true })
  xPos: number

  @Field(() => Int, { nullable: true })
  yPos: number

  @Field(() => Boolean)
  show: boolean
}

@InputType({ description: 'The type used for getting a slide' })
export class GetSlideInput {
  @Field(() => String)
  key: string
}
