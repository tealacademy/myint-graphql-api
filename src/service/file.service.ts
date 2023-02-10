import { File, CreateFileInput, GetFileInput, FileModel } from '../schema/file.schema'
import { User } from '../schema/user.schema'
import { Upload } from '../types/upload'
import S3loader from '../utils/s3.storage/s3.loader'
import config from 'config'

//! todo: getbucketname from config
class FileService {
  async addFile(input: CreateFileInput & { owner: User['_id'] }, { encoding, mimetype, createReadStream }: Upload) {
    console.log('create file')

    // save the metadata of the file to DB
    const file: File = await FileModel.create(input)

    // save the file to s3
    new S3loader().upload(config.get('fileBucket'), input.owner, file._id, createReadStream())

    return file
  }

  async findFiles() {
    return FileModel.find().lean()
  }

  async findSingleUserFile(input: GetFileInput & { owner: User['_id'] }) {
    console.log('get file')

    const fileMetaData = await FileModel.findOne(input).lean()

    const file = fileMetaData ? new S3loader().download(config.get('fileBucket'), input.owner, fileMetaData._id) : null

    return file
  }
}

export default FileService
