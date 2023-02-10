/* NODE.JS using AWS SDK for JavaScript v 3,

config options:
 - BUCKET_NAME
 - KEY
 - BODY
 
 this assumes there is a local AWS credentials file on the .aws path in the runtime environment. To get access to the AWS S3 account.
*/

// Import AWS SDK clients and AWS commands.
import { PutObjectCommand, CreateBucketCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from './s3.client'

// config parameters
// const configparams = {
//  Bucket: "BUCKET_NAME",// name of the bucket. eg: 'samplebucket_1'.
//  Key: "KEY", // name of the object. Eg:, 'sample_upload.txt'.
//  Body: "BODY", // content of the object. Eg.:'Hello world!".
// }

export default class S3loader {
  public upload = async (bucket: string, userId: string, filekey: string, file: any) => {
    // try to create the S3 bucket.
    try {
      const data = await s3Client.send(new CreateBucketCommand({ Bucket: bucket }))
      console.log(data)
      console.log('Successfully created bucket: ', data.Location)
    } catch (error) {
      console.log('Could not create new bucket', error)
    }

    // Create object and upload it to the S3 bucket.
    try {
      const results = await s3Client.send(new PutObjectCommand({ Bucket: bucket, Key: filekey, Body: file }))
      console.log(results)
      console.log('Successfully created object ' + filekey + ' and placed into bucket: ' + bucket + '/' + filekey)

      return results
    } catch (error) {
      console.log('Error', error)
    }
  }

  public download = async (bucket: string, userId: string, filekey: string) => {
    try {
      // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
      const data = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: filekey }))

      // Convert the ReadableStream to a string.
      console.log('Successfully downloaded object ' + filekey)

      const body = data.Body ? await data.Body.transformToString() : ''
      return body
    } catch (err) {
      console.log('Error', err)
    }
  }
}
