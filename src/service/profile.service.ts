import { CreateProfileInput, GetProfileInput, ProfileModel } from '../schema/profile.schema'
// import { EdgeModel } from '../schema/edge.schema'

class ProfileService {
  async createProfile(input: CreateProfileInput) {
    return ProfileModel.create(input)
  }

  // async updateProfile(input: UpdateProfileInput) {
  //   // When we update settings, we do not keep track of older versions

  //   // Find the 'active' (most recent) profile
  //   // To specify ascending order for a field, set the field to 1 in the sort document.
  //   // To specify descending order for a field, set the field and -1 in the sort documents.
  //   const edges = await EdgeModel.find({ nodeA: input.userId, label: 'user_profile' }).sort({ createdAt: -1 })

  //   // Get Profile-id from nodeB
  //   const filter = { _id: edges[0].nodeB }
  //   // find most recent edge with nodeA is user, label = 'user_profile'

  //   const updateDoc = input.updateDocument

  //   return ProfileModel.updateOne(filter, { $set: { updateDoc } })
  // }

  async findProfiles() {
    return ProfileModel.find().lean()
  }

  async findSingleProfile(input: GetProfileInput) {
    ProfileModel.findOne(input).lean()
    return ProfileModel.findOne(input).lean()
  }
}

export default ProfileService

// Bewerkingen op de database
// find() - Show all documents in the collection. Documents are like records in an SQL database.
// insertOne( { title: "Learn MongoDB", content: "Lorem Ipsum." } ) - Insert a document into a collection. Must use double quotes for a string.
// find({title: "Learn MongoDB"}) - Returns all that match the condition.
// findOne({title: "Learn MongoDB"}) - Returns the first document that matches the condition.
// findOne({"_id" : ObjectId("id-string-here")}); - Find by id.
// updateOne({title:"Learn MongoDB"},{ $set: {content:"Blah Blah."}}) - Updates a specific field in a document. Adds document if it doesn't exist. Use updateMany() for multiple.
// update({"_id" : ObjectId("id-string-here")},{ $set: {content:"Blah Blah Blah!"}}) - Find by ID then update.
// deleteOne( { title: "Learn MongoDB" }) - Remove one document by non-id field. Use deleteMany() for multiple.
// deleteOne( { "_id": ObjectId("value") })

// example updateDoc:
// "_id" : 1,
// "item" : "TBD",
// "stock" : 0,
