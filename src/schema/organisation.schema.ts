import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, InterfaceType, ID, Int } from 'type-graphql'
import { Edge } from './edge.schema'
import { Address } from './profile.schema'
import { Group, ParticipantGroup } from './group.schema'
import { Permission } from './role.schema'

@ObjectType({ description: 'The message model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Organisation extends Group {
  @Field(() => Address)
  @prop({ required: false })
  address?: Address

  @Field(() => Organisation)
  @prop({ ref: () => Organisation })
  organisations: Organisation[]

  @Field(() => Boolean)
  @prop({ required: true, default: false })
  inherentRightsFromParent: boolean

  @Field(() => Permission)
  @prop({ required: false })
  defaultPermissions?: Permission
}

@ObjectType({ description: 'The edge between organisation and usergroup defining roles' })
@modelOptions({ options: { allowMixed: 0 } })
export class OrganisationUserGroupEdge extends Edge {
  @Field(() => Organisation)
  @prop({ ref: () => Organisation })
  organisation: Ref<Organisation>

  @Field(() => ParticipantGroup)
  @prop({ ref: () => ParticipantGroup })
  participants: Ref<ParticipantGroup>
}

// @ObjectType({ description: 'The edge between organisation and participants defining groups of users' })
// @modelOptions({ options: { allowMixed: 0 } })
// export class OrganisationPartipicantsGroupEdge extends Edge {
//   @Field(() => Organisation)
//   @prop({ ref: () => Organisation })
//   organisation: Ref<Organisation>

//   @Field(() => ParticipantGroup)
//   @prop({ ref: () => ParticipantGroup })
//   participantsGroup: Ref<ParticipantGroup>
// }

export const OrganisationModel = getModelForClass<typeof Organisation>(Organisation, { schemaOptions: { timestamps: { createdAt: true } } })
export const OrganisationUserGroupEdgeModel = getModelForClass<typeof OrganisationUserGroupEdge>(OrganisationUserGroupEdge, {
  schemaOptions: { timestamps: true },
})

@InputType({ description: 'The type used for creating a new organisation' })
export class CreateOrganisationInput implements Partial<Organisation> {
  @Field(() => String)
  name: string

  @Field(() => [Organisation])
  organisations: Organisation[]
}
