import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Tag, ListTagInput } from './tag.schema'
import { Frame, ListFrameInput } from './frame.schema'
import { Piece, ListPieceInput } from './piece.schema'
import { Clue } from './clue.schema'
import { User } from './user.schema'
import { Field, InputType, ObjectType, ID, Int, createUnionType } from 'type-graphql'

@ObjectType({ description: 'The myintset-object model' })
@modelOptions({ options: { allowMixed: 0 } })
export class MyinTSet {
  @Field((type) => ID)
  _id: string

  @Field(() => User) // Remove if field not publicly accessible?
  @prop({ required: true, ref: () => User })
  owner: Ref<User> // This is a reference to a user

  @Field(() => [String], { nullable: true }) // a myintset has 0..n tags
  @prop({ required: false, default: [], ref: () => String })
  tags?: Ref<string>[]

  @Field(() => [String], { nullable: true }) // a myintset has 0..n frames
  @prop({ required: false, default: [], ref: () => String })
  pieces?: Ref<string>[]

  @Field(() => [String], { nullable: true }) // a myintset has 0..n frames
  @prop({ required: false, default: [], ref: () => String })
  frames?: Ref<string>[]

  @prop({ required: false })
  deleted?: Date
}

export const MyinTSetModel = getModelForClass<typeof MyinTSet>(MyinTSet, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new myintset' })
export class CreateMyinTSetInput {
  @Field(() => String)
  Id: string

  @Field(() => String) // Remove if field not publicly accessible?
  owner: string // This is a reference to a user

  @Field(() => [ListPieceInput], { nullable: true }) // a myintset has 0..n pieces
  pieces?: ListPieceInput[]

  @Field(() => [ListFrameInput], { nullable: true }) // a myintset has 0..n frames
  frames?: ListFrameInput[]

  @Field(() => [ListTagInput], { nullable: true }) // a myintset has 0..n frames
  tags?: ListTagInput[]
}

@InputType({ description: 'The type used for getting a myintset' })
export class GetMyinTSetInput {
  @Field()
  Id: string
}
