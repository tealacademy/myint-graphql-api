import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, InterfaceType, ID, Int } from 'type-graphql'
import { Edge } from './edge.schema'
import { Profile } from './profile.schema'
import { UserGroup, Group } from './group.schema'

@ObjectType({ description: 'The message model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Organisation extends Group {
  @Field(() => Profile)
  @prop({ required: false })
  profile?: Profile

  @Field(() => Organisation)
  @prop({ ref: () => Organisation })
  organisations: Organisation[]
}

@ObjectType({ description: 'The edge between organisation and groups' })
@modelOptions({ options: { allowMixed: 0 } })
export class OrganisationGroupEdge extends Edge {
  @Field(() => Organisation)
  @prop({ ref: () => Organisation })
  organisations: Ref<Organisation>

  @Field(() => UserGroup)
  @prop({ ref: () => UserGroup })
  group: Ref<UserGroup>
}

export const OrganisationModel = getModelForClass<typeof Organisation>(Organisation, { schemaOptions: { timestamps: { createdAt: true } } })
export const OrganisationGroupEdgeModel = getModelForClass<typeof OrganisationGroupEdge>(OrganisationGroupEdge, { schemaOptions: { timestamps: true } })

@InputType({ description: 'The type used for creating a new organisation' })
export class CreateOrganisationInput implements Partial<Organisation> {
  @Field(() => String)
  name: string

  @Field(() => [Organisation])
  organisations: Organisation[]
}
