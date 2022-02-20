import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Tag } from './tag.schema'
import { Frame, ListFrameInput } from './frame.schema'
import { User } from './user.schema'
import { Field, InputType, ObjectType, ID, Int, createUnionType } from 'type-graphql'

@ObjectType({ description: 'The challenge-object model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Challenge {
  @Field((type) => ID)
  _id: string

  @Field(() => User) // Remove if field not publicly accessible?
  @prop({ required: true, ref: () => User })
  owner: Ref<User> // This is a reference to a user

  @Field(() => String)
  @prop({ required: false })
  name: string

  @Field(() => String)
  @prop({ required: true })
  question: string

  @Field(() => String)
  @prop({ required: false })
  narrative?: string

  @Field(() => [String]) // a challenge has 0..n frames
  @prop({ required: true, default: [], ref: () => String })
  frames: Ref<string>[]

  @prop({ required: false })
  deleted?: Date
}

export const ChallengeModel = getModelForClass<typeof Challenge>(Challenge, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new frame' })
export class CreateChallengeInput {
  @Field(() => String, { defaultValue: '' })
  Id: string

  @Field(() => String) // Remove if field not publicly accessible?
  owner: string // This is a reference to a user

  @Field(() => String)
  question: string

  @Field(() => String, { nullable: true })
  narrative?: string

  @Field(() => [ListFrameInput]) // a challenge has 0..n frames
  frames: ListFrameInput[]
}

@InputType({ description: 'The type used for getting a frame' })
export class GetChallengeInput {
  @Field()
  Id: string
}

@InputType({ description: 'The type used for adding a frame' })
export class ListRefFrame {
  @Field(() => Frame)
  frame: Ref<Frame>
}
