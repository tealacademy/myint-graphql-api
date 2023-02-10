export default {
  domain: 'localhost',
  clientDomain: 'http://localhost:3000/',
  dbUri: `mongodb://${process.env.MONGO_PASSWORD}/?tls=true&tlsAllowInvalidCertificates=true`,
  serverPort: 4000,
  fileBucket: `devMyinTBucket`,
}
