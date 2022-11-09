import { getModelForClass, modelOptions, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { VersionEdge } from './edge.schema'
import { MODELS } from './../types/data'
import { MyinTObjectOwner } from './myintobject.schema'

@ObjectType({ description: 'The role model' })
@modelOptions({ options: { allowMixed: 0 } })
export class Role extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: false })
  title?: string

  @Field(() => String)
  @prop({ required: false })
  description?: string

  @Field(() => [Permission])
  @prop({ required: true, default: [] })
  permissions: Permission[]
}

@ObjectType({ description: 'The permissions' })
// @modelOptions({ options: { allowMixed: 0 } })
export class Permission {
  @Field(() => MODELS)
  @prop({ required: true })
  objectType: string

  @Field(() => Boolean)
  @prop({ required: true, default: false })
  create: boolean

  @Field(() => Boolean)
  @prop({ required: true, default: false })
  read: boolean

  @Field(() => Boolean)
  @prop({ required: true, default: false })
  update: boolean

  @Field(() => Boolean)
  @prop({ required: true, default: false })
  delete: boolean
}

@ObjectType({ description: 'The edge for changes on a clue' })
@modelOptions({ options: { allowMixed: 0 } })
export class RoleVersionEdge extends VersionEdge {
  // Original role
  @Field(() => Role)
  @prop({ required: true, ref: () => Role })
  roleOld: Ref<Role>

  // Copy or original role
  @Field(() => Role)
  @prop({ required: true, ref: () => Role })
  roleNew: Ref<Role>
}

export const RoleModel = getModelForClass<typeof Role>(Role, { schemaOptions: { timestamps: true } })

@InputType({ description: 'The type used for creating a new role' })
export class CreateRoleInput implements Partial<Role> {
  @Field(() => String, { defaultValue: '' })
  Id: string

  @Field(() => String)
  title?: string

  @Field(() => String)
  description?: string

  @Field(() => [Permission])
  permissions: Permission[]
}

@InputType({ description: 'The type used for creating a new Role' })
export class ListRoleInput {
  @Field(() => String)
  Id: string
}

@InputType({ description: 'The type used for getting a Role' })
export class GetRoleInput {
  @Field(() => String)
  Id: string
}
