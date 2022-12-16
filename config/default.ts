export default {
  dbUri: `mongodb://ec2-3-252-87-121.eu-west-1.compute.amazonaws.com/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  serverPort: 4000,
}
// Database at mongo-cloud
// dbUri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.uq7mx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,

// dbUri: "mongodb+srv://rkvdmeer:Codes008!@cluster0.uq7mx.mongodb.net/myint?retryWrites=true&w=majority"

// van Albert:
//     dbUri: `mongodb://ec2-3-252-87-121.eu-west-1.compute.amazonaws.com/${process.env.MONGO_DB}?retryWrites=true&w=majority`
//      Let op, hier dus geen +srv.. dit omdat je niet atlas gebruikt op de locatie waar mongoDB staat.

// mongo --host ec2-3-252-87-121.eu-west-1.compute.amazonaws.com
