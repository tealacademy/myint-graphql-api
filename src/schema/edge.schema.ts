import { prop, Ref } from '@typegoose/typegoose'
import { Field, ObjectType, ID } from 'type-graphql'
import { User } from './user.schema'
import { Changeset } from './../utils/json-diff-ts/jsonDiff'

/**
 * Relations in our database are made with edges between nodes.
 */
@ObjectType({ description: 'The basic edge model' })
export class Edge {
  @Field((type) => ID)
  _id: string

  @Field(() => String)
  @prop({ required: true })
  label: string

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  owner: Ref<User> // added the edge

  @prop({ required: false })
  deleted?: Date
}

@ObjectType({ description: 'The edge for changes on an object' })
export class VersionEdge extends Edge {
  // delta of the change
  @Field(() => String)
  @prop({ required: false })
  delta?: Changeset

  @Field(() => Number)
  @prop({ required: true })
  version: number
}

// export const EdgeModel = getModelForClass<typeof Edge>(Edge, { schemaOptions: { timestamps: { createdAt: true } } })
