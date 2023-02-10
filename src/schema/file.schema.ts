import { getModelForClass, prop } from '@typegoose/typegoose'
import { assertScalarType } from 'graphql'
import { Field, InputType, ObjectType, ID, Int } from 'type-graphql'
import { MyinTObjectOwner } from './myintobject.schema'

/**
 * Metadata for locally stored files
 */
@ObjectType({ description: 'The file model' })
export class File extends MyinTObjectOwner {
  @Field(() => String)
  @prop({ required: true })
  name: string

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  @Field(() => String)
  @prop({ required: true })
  mimetype: string

  @Field(() => String, { nullable: true })
  @prop({ required: false })
  encoding?: string
}

export const FileModel = getModelForClass<typeof File>(File, { schemaOptions: { timestamps: { createdAt: true } } })

@InputType({ description: 'The type used for creating a new file' })
export class CreateFileInput {
  @Field(() => String)
  name: string

  @Field(() => String)
  mimetype: string
}

@InputType({ description: 'The type used for getting a file' })
export class GetFileInput {
  @Field(() => String)
  Id: string
}
