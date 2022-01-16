export default {
  // dbUri: "mongodb+srv://rkvdmeer:Codes008!@cluster0.uq7mx.mongodb.net/myint?retryWrites=true&w=majority"
  dbUri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.uq7mx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  serverPort: 4000,
}
