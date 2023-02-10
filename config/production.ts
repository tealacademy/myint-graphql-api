export default {
  domain: 'www.myint.io',
  serverPort: 4000,
  clientDomain: 'http://localhost:3000/',
  dbUri: `mongodb://${process.env.MONGO_PASSWORD}/?tls=true&tlsAllowInvalidCertificates=true`,
}
