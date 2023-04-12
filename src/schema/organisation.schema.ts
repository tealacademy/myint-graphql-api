import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, InterfaceType, ID, Int } from 'type-graphql'
import { Edge } from './edge.schema'
import { Address } from './profile.schema'
import { Group, Tribe } from './group.schema'
import { Permission } from './role.schema'

/** The organisation model
 *
 */
@ObjectType({ description: 'The organisation model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Organisation extends Group {
  @Field(() => Address)
  @prop({ required: false })
  address?: Address

  // An organisation always has 1 Tribe of users that form
  // the organisation. It describes also the role the user has within
  // this organisation.
  @Field(() => Tribe)
  @prop({ ref: () => Tribe })
  basicTribe: Ref<Tribe>
}

/** The edge between Organisation and definable Tribes
 *
 */
@ObjectType({ description: 'The edge between Organisation and definable Tribes' })
@modelOptions({ options: { allowMixed: 0 } })
export class OrganisationTribeEdge extends Edge {
  @Field(() => Organisation)
  @prop({ ref: () => Organisation })
  organisation: Ref<Organisation>

  @Field(() => Tribe)
  @prop({ ref: () => Tribe })
  tribe: Ref<Tribe>
}

export const OrganisationModel = getModelForClass<typeof Organisation>(Organisation, { schemaOptions: { timestamps: { createdAt: true } } })
export const OrganisationTribeEdgeModel = getModelForClass<typeof OrganisationTribeEdge>(OrganisationTribeEdge, {
  schemaOptions: { timestamps: true },
})

@InputType({ description: 'The type used for creating a new organisation' })
export class CreateOrganisationInput implements Partial<Organisation> {
  @Field(() => String)
  name: string

  @Field(() => Organisation)
  organisation: Organisation
}
