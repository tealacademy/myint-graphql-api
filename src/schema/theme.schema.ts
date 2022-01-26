import { getModelForClass, index, Prop, prop, Ref } from '@typegoose/typegoose'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'

@ObjectType({ description: 'The theme model' })
export class Theme {
  @Field((type) => ID)
  _id: string

  @Field(() => String)
  @prop({ required: true })
  title: string

  @Field(() => String)
  @prop({ required: false })
  layout: string

  @prop({ required: true, nullable: true, default: null })
  deleted: Date
}

export const ThemeModel = getModelForClass<typeof Theme>(Theme, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new theme' })
export class CreateThemeInput implements Partial<Theme> {
  @Field(() => String)
  title: string

  @Field(() => String)
  layout: string
}

@InputType({ description: 'The type used for getting a theme' })
export class GetThemeInput {
  @Field(() => String)
  themeID: string
}
