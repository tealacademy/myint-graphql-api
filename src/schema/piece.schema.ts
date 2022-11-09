import { getModelForClass, index, isRefType, isRefTypeArray, modelOptions, Prop, prop, Ref, Severity } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { customAlphabet } from 'nanoid'
import { User } from './user.schema'
import { MyinTObjectOwner } from './myintobject.schema'
import { Edge, VersionEdge } from './edge.schema'
// import { Slide, CreateSlideInput } from './slide.schema'
import { Theme } from './theme.schema'
import { UserGroup } from './group.schema'
import { Tag, CreateTagInput } from './tag.schema'
import { Changeset } from './../utils/json-diff-ts/jsonDiff'
import { IsNumber, MaxLength, Min, MinLength, IsUrl, IsArray, ValidateNested, IsObject } from 'class-validator'
import Context from './../types/context'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz123456789', 10)

@ObjectType({ description: 'The piece model' })
// @index({ index: 1 })
@modelOptions({ options: { allowMixed: 0 } }) // https://typegoose.github.io/typegoose/docs/api/decorators/model-options/#allowmixed
export class Piece extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: true, defaultValue: '' })
  title: string

  @Field(() => String, { nullable: true })
  @prop({ required: false })
  deepMyinT?: string

  @Field(() => [Tag])
  @prop({ required: true })
  tags: Tag[]

  @Field(() => [Slide])
  @prop({ required: true })
  slides: Slide[]

  @Field(() => Theme, { nullable: true })
  @prop({ required: false, ref: () => Theme })
  theme?: Ref<Theme>

  // number of updates on this piece
  @Field((type) => Int)
  @prop({ required: true })
  updateVersion: number

  // ! th copy of piece
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

@ObjectType({ description: 'The slide model' })
// @modelOptions({ options: { allowMixed: 0 } })
export class Slide {
  @Field(() => String)
  key: string

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
  @Field(() => String)
  key: string

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

@ObjectType({ description: 'The edge for changes on a clue' })
@modelOptions({ options: { allowMixed: 0 } })
export class PieceVersionEdge extends VersionEdge {
  // Original piece
  @Field(() => Piece)
  @prop({ required: true, ref: () => Piece })
  oldPiece: Ref<Piece>

  // Copy or original piece
  @Field(() => Piece)
  @prop({ required: true, ref: () => Piece })
  newPiece: Ref<Piece>
}

@ObjectType({ description: 'The edge for changes on a clue' })
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

@InputType({ description: 'The type used for creating a new piece' })
export class CreatePieceInput {
  @Field(() => String)
  title: string

  @Field(() => String)
  owner: string

  @Field(() => String)
  deepMyinT?: string

  @Field(() => [CreateTagInput])
  tags: CreateTagInput[]

  @Field(() => [CreateSlideInput])
  slides: CreateSlideInput[]

  @Field(() => String)
  theme?: string

  // input?
  // @Field(() => Number)
  // version: number

  @Field(() => Boolean)
  autoPlay?: boolean

  @Field(() => Boolean)
  updateWithOriginal: boolean
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
}

@InputType({ description: 'The type used for updating a single piece' })
export class UpdatePieceInput {
  @Field(() => String)
  Id: string

  @Field(() => String)
  delta: Changeset

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
  key: string
}
