import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { User } from './user.schema'
import { MyinTObjectOwner } from './myintobject.schema'

@ObjectType({ description: 'The tag model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Tag extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: true })
  title: string
}

export const TagModel = getModelForClass<typeof Tag>(Tag, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new tag' })
export class CreateTagInput implements Partial<Tag> {
  @Field(() => String, { defaultValue: '' })
  Id: string

  @Field(() => String)
  title: string
}

@InputType({ description: 'The type used for creating a new tag' })
export class ListTagInput {
  @Field(() => String)
  Id: string
}

@InputType({ description: 'The type used for getting a tag' })
export class GetTagInput {
  @Field(() => String)
  Id: string
}
