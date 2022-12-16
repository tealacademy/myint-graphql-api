import { prop, modelOptions } from '@typegoose/typegoose'
import { Field, ObjectType, ID } from 'type-graphql'
import { MyinTObjectOwner } from './myintobject.schema'
import { Changeset } from './../utils/json-diff-ts/jsonDiff'

/**
 * Relations in our database are made with edges between nodes.
 */
@ObjectType({ description: 'The basic edge model' })
export class Edge extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: true })
  label: string
}

@ObjectType({ description: 'The edge for changes on an object' })
@modelOptions({ options: { allowMixed: 0 } })
export class VersionEdge extends Edge {
  // delta of the change. Typegoose has only String as Type, but we want de delta of type Changeset (will be json-string)
  @Field((type) => String)
  @prop({ required: false })
  delta?: Changeset

  @Field(() => Number)
  @prop({ required: true })
  version: number
}

// export const EdgeModel = getModelForClass<typeof Edge>(Edge, { schemaOptions: { timestamps: { createdAt: true } } })
