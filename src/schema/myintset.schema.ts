import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Tag, ListTagInput } from './tag.schema'
import { Frame, ListFrameInput } from './frame.schema'
import { Piece, ListPieceInput } from './piece.schema'
import { User } from './user.schema'
import { MyinTObjectOwner } from './myintobject.schema'
import { Field, InputType, ObjectType, ID, Int, createUnionType } from 'type-graphql'

@ObjectType({ description: 'The myintset-object model' })
@modelOptions({ options: { allowMixed: 0 } })
export class MyinTSet extends MyinTObjectOwner {
  // Why does a MyinTSet need tags?
  // To show all pieces and frames with those tags? => maybe handy? I don't know
  // @Field(() => [String], { nullable: true }) // a myintset has 0..n tags
  // @prop({ required: false, default: [], ref: () => Tag })
  // tags?: Ref<Tag>[]

  @Field(() => [String], { nullable: true }) // a myintset has 0..n frames
  @prop({ required: false, default: [], ref: () => Piece })
  pieces: Ref<Piece>[]

  @Field(() => [String], { nullable: true }) // a myintset has 0..n frames
  @prop({ required: false, default: [], ref: () => Frame })
  frames: Ref<Frame>[]
}

export const MyinTSetModel = getModelForClass<typeof MyinTSet>(MyinTSet, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new myintset' })
export class CreateMyinTSetInput {
  @Field(() => String)
  Id: string

  @Field()
  owner?: string // This is a reference to a user. If null then current user = owner

  @Field(() => [ListPieceInput], { nullable: true }) // a myintset has 0..n pieces
  pieces?: ListPieceInput[]

  @Field(() => [ListFrameInput], { nullable: true }) // a myintset has 0..n frames
  frames?: ListFrameInput[]

  // @Field(() => [ListTagInput], { nullable: true }) // a myintset has 0..n frames
  // tags?: ListTagInput[]
}

@InputType({ description: 'The type used for getting a myintset' })
export class GetMyinTSetInput {
  @Field()
  Id: string
}
