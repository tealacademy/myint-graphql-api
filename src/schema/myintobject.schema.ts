import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { Field, ObjectType, ID } from 'type-graphql'
import { User } from './user.schema'
// import { UserGroup } from './group.schema'
import { Theme } from './theme.schema'
import { Edge } from './edge.schema'

/**
 * Relations in our database are made with edges between nodes.
 */
@ObjectType({ description: 'The basic myintobject model' })
export class MyinTObject {
  @Field((type) => ID)
  _id: string

  @Field(() => Date, { nullable: true })
  @prop({ required: true })
  createdAtClient: Date

  @Field(() => Date)
  @prop({ required: false })
  deletedAtClient?: Date
}

@ObjectType({ description: 'The tokens that give different rights' })
export class Tokens {
  @Field(() => String)
  @prop({ required: false })
  creatorToken?: string

  @Field(() => String)
  @prop({ required: false })
  editorToken?: string

  @Field(() => String)
  @prop({ required: false })
  viewerToken?: string
}

@ObjectType({ description: 'Basic myintobject model adding the owner of the object' })
export class MyinTObjectOwner extends MyinTObject {
  // This is a reference to the user who created the object. Can never be another then the one that created it.
  // We do not use the fieldname 'creator' because you can get a copu of an object. You then will be the
  // owner, but did not actually create the object.
  @Field(() => User, { nullable: false })
  //@prop({ required: true, ref: () => User })
  // The 'Nested'(as string) form is useful to avoid unintuitive errors due to circular
  // dependencies, such as Option "ref" for "${name}.${key}" is null/undefined! [E005].
  @prop({ required: true, ref: 'User', immutable: true })
  owner: Ref<User>

  // THe tokens that give different rights on this object.
  @Field(() => Tokens)
  @prop({ required: true })
  tokens: Tokens
}

@ObjectType({ description: 'The MyinT every user has' })
@modelOptions({ options: { allowMixed: 0 } })
export class MyinT extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: true, defaultValue: '' })
  title: string

  // If no theme set, default theme is used
  @Field(() => Theme, { nullable: true })
  @prop({ required: false, ref: () => Theme })
  slideTheme?: Ref<Theme>
}

/**
 * MyinTGroupEdge stores relation between MyinT and groups who have certain
 * rights on this MyinT. Roles (like editor, viewer etc) are stored in UserGroup
 */
// @ObjectType({ description: 'Edge: which group(s) has the right to use a piece' })
// @modelOptions({ options: { allowMixed: 0 } })
// export class MyinTGroupEdge extends Edge {
//   // Original piece
//   @Field(() => MyinT)
//   @prop({ required: true, ref: () => MyinT })
//   piece: Ref<MyinT>

//   // Copy or original piece
//   @Field(() => UserGroup)
//   @prop({ required: true, ref: () => UserGroup })
//   group: Ref<UserGroup>
// }

export const MyinTModel = getModelForClass<typeof MyinT>(MyinT, { schemaOptions: { timestamps: { createdAt: true, updatedAt: true } } })
// export const MyinTGroupEdgeModel = getModelForClass<typeof MyinTGroupEdge>(MyinTGroupEdge, { schemaOptions: { timestamps: { createdAt: true } } })
