import { prop, modelOptions } from '@typegoose/typegoose'
import { Field, ObjectType, ID } from 'type-graphql'
import { MyinTObjectOwner } from './myintobject.schema'
import { Changeset } from './../utils/json-diff-ts/jsonDiff'

/**
 * Edges between nodes are used for the following
 * - storing 1-n relations between documents in our database.
 * - storing
 */
@ObjectType({ description: 'The basic edge model' })
export class Edge extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: true })
  label: string
}

/**
 * We want to transfer changed documents between client en server by delta. We do this because
 * we want to make data-traffic as minimal as possible. This is necessary because of
 * - piece-documents or frame-documents can become quite big
 * - changes in documents that can be shared with other users (for example to view) must be updated on all clients.
 *   A change on one client has to be sent to multiple clients and not overwrite changes that are made on that client.
 * - Storing the delta on the server also stores the history in a compact way.
 */
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
