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
}

export const ThemeModel = getModelForClass<typeof Theme>(Theme, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new theme' })
export class CreateThemeInput {
  @Field()
  title: string

  @Field()
  layout: string
}

@InputType({ description: 'The type used for getting a theme' })
export class GetThemeInput {
  @Field()
  themeID: string
}
