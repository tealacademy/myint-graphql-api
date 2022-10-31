import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, ID } from 'type-graphql'
import { Edge } from './edge.schema'

@ObjectType({ description: 'The log model' })
export class Log {
  @Field((type) => ID)
  _id: string

  // Action that has been done in the API on Object
  @Field(() => String)
  @prop({ required: true })
  action: string

  @Field(() => String)
  @prop()
  data: string
}

@ObjectType({ description: 'The edge between ref of Log and id of object' })
export class LogObjectEdge extends Edge {
  @Field(() => Log)
  @prop({ required: true, ref: () => Log })
  log: Ref<Log>

  @Field(() => String)
  @prop({ required: true })
  actionObject: String
}

export const LogModel = getModelForClass<typeof Log>(Log, { schemaOptions: { timestamps: true } })
export const LogObjectEdgeModel = getModelForClass<typeof LogObjectEdge>(LogObjectEdge, { schemaOptions: { timestamps: true } })

@InputType({ description: 'The type used for creating a new log-item' })
export class CreateLogInput {
  @Field()
  action: string

  @Field()
  data: string
}
