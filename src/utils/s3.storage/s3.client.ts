/* using AWS SDK for JavaScript version 3 (v3),

s3Client.ts is helper that creates an Amazon Simple Service Solution (S3) client.

config option:
- REGION

*/
import { S3Client } from '@aws-sdk/client-s3'
//
// Create new S3 service client object,
// and set the AWS Region where the buckets are kept
// REGION = "eu-west-1"; //e.g. "us-east-1"
const s3Client = new S3Client({ region: 'eu-west-1' })
export { s3Client }
