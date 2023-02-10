export default {
  domain: 'localhost',
  clientDomain: 'http://localhost:3000/',
  // dbUri: mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DB}/?tls=true&tlsAllowInvalidCertificates=true
  dbUri: `mongodb://${process.env.MONGO_DB}/?tls=true&tlsAllowInvalidCertificates=true`,
  serverPort: 4000,
  fileBucket: `devMyinTBucket`,
}
