import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreateFileInput, GetFileInput, File } from '../schema/file.schema'
import FileService from '../service/file.service'
import Context from '../types/context'
import { GraphQLUpload } from 'graphql-upload-minimal'
import { Upload } from '../types/upload'
import Uploader from '../utils/s3.storage/s3.loader'

@Resolver()
export default class FileResolver {
  // Dependency Injection?
  constructor(private fileService: FileService) {
    this.fileService = new FileService()
  }

  // GraphQLUpload is a scalar to upload a file
  //input: CreateFileInput
  @Authorized() // uses AuthChecker (imported in schema in index.ts)
  // We define a mutation. The return-value is the database-id for the metadata for this file.
  @Mutation(() => String)

  // As arguments we have the meta-data, the file and the current context
  // The @Arg file is a function from graphql-upload-minimal
  // Because we do not have the return type, we define one (Upload) and we deconstruct
  // the return-value. We do not need filename because we give the file the name of its database-id
  async addFile(
    @Arg('input') input: CreateFileInput,
    @Arg('file', () => GraphQLUpload)
    file: Upload,
    @Ctx() context: Context
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const user = context.user!
      // save the metadata of the file to the database
      const fileData: File = await this.fileService.addFile({ ...input, owner: user._id }, file)

      // ! is naar file.service
      // const result = new Uploader().upload('samplebucket', user._id, fileData._id, createReadStream())

      if (fileData._id) {
        resolve(fileData._id)
      } else {
        reject(new Error('file.resolver: Error in saving file ' + input.name))
      }
    })
  }

  @Authorized()
  @Query(() => File)
  getFile(@Arg('input') input: GetFileInput, @Ctx() context: Context) {
    const user = context.user!
    const file = this.fileService.findSingleUserFile({ ...input, owner: user._id })
  }
}
