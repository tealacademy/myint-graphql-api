import { getModelForClass, index, Prop, prop, Ref } from "@typegoose/typegoose"
import { Field, InputType, ObjectType, ID, Int } from "type-graphql"
import { User } from "./user.schema"
import Context from "../types/context"

@ObjectType({ description: "The tag model" })
export class Tag {
  @Field(type => ID)
  _id: string

  @Field(() => String)
  @prop({ required: true })
  title: string
}

export const TagModel = getModelForClass<typeof Tag>(Tag, { schemaOptions: { timestamps: { createdAt: true }}})

@InputType({ description: "The type used for creating a new tag" })
export class CreateTagInput {
  @Field()
  tagID: string

  @Field()
  title: string
}

@InputType({ description: "The type used for getting a tag" })
export class GetTagInput {
  @Field()
  title: string
}
