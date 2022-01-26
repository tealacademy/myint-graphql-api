import { getModelForClass, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { User } from './user.schema'
import Context from '../types/context'

@ObjectType({ description: 'The tag model' })
export class Tag {
  @Field((type) => ID)
  _id: string

  @Field(() => String)
  @prop({ required: true })
  title: string

  @prop({ required: true, nullable: true, default: null })
  deleted: Date
}

export const TagModel = getModelForClass<typeof Tag>(Tag, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new tag' })
export class CreateTagInput implements Partial<Tag> {
  @Field(() => String)
  title: string
}

@InputType({ description: 'The type used for creating a new tag' })
export class ListTagInput implements Partial<Tag> {
  @Field(() => String)
  tagId: string

  @Field(() => String)
  title: string
}

@InputType({ description: 'The type used for getting a tag' })
export class GetTagInput implements Partial<Tag> {
  @Field(() => String, { nullable: true })
  tagId: string

  @Field(() => String, { nullable: true })
  title: string
}
