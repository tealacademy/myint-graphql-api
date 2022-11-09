import { getModelForClass, prop } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { MyinTObjectOwner } from './myintobject.schema'

@ObjectType({ description: 'The theme model' })
export class Theme extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: true })
  name: string

  @Field(() => String, { nullable: true })
  @prop({ required: false })
  layout?: string
}

export const ThemeModel = getModelForClass<typeof Theme>(Theme, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new theme' })
export class CreateThemeInput implements Partial<Theme> {
  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  layout?: string
}

@InputType({ description: 'The type used for getting a theme' })
export class GetThemeInput {
  @Field(() => String)
  Id: string
}
