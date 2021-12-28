import { prop } from "@typegoose/typegoose"
import { Field, InputType, ObjectType, ID } from "type-graphql"

@ObjectType({ description: "The edge model" })
export class Edge {
  @Field(type => ID)
  _id: string

  @Field(() => String)
  @prop({ required: true })
  nodeA: string

  @Field(() => String)
  @prop({ required: true })
  nodeB: string

  @Field(() => String)
  @prop({ required: true })
  label: string
}

@InputType({ description: "The type used for creating a new edge" })
export class CreateEdgeInput {
  @Field()
  nodeA: string

  @Field()
  nodeB: string

  @Field()
  label: string
}

@InputType({ description: "The type used for getting an edge" })
export class GetEdgeInput {
  @Field({ nullable: true })
  edgeId: string

  @Field({ nullable: true })
  nodeA: string

  @Field({ nullable: true })
  nodeB: string

  @Field({ nullable: true })
  label: string
}
