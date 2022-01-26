import { getModelForClass, prop } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, ID } from 'type-graphql'

@ObjectType({ description: 'The log model' })
export class Log {
  @Field((type) => ID)
  _id: string

  @Field(() => String)
  @prop({ required: true })
  action: string

  @Field(() => String)
  @prop()
  data: string
}

export const LogModel = getModelForClass<typeof Log>(Log, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new log-item' })
export class CreateLogInput {
  @Field()
  action: string

  @Field()
  data: string
}
