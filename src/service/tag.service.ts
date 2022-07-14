import { CreateTagInput, GetTagInput, ListTagInput, TagModel, Tag } from '../schema/tag.schema'
import { User } from '../schema/user.schema'
import EdgeService from '../service/edge.service'
import { TAG_EDGES } from '../types/enums'

class TagService {
  async createTag(input: CreateTagInput & { owner: User['_id'] }) {
    // Create the tag and link it to the current user

    // Allways uppercase
    input.title = input.title.toUpperCase()
    const newTag = await TagModel.create(input)

    // Create an edge with the user/owner of the tag
    const edgeService = new EdgeService()
    const edge = edgeService.createEdge({ ...input, nodeA: input.owner, nodeB: newTag._id, label: TAG_EDGES.USER_TAG })

    return newTag
  }

  async findUserTags(userId: string) {
    const tags = await TagModel.find({ owner: userId }).lean()

    // console.log('tags', tags)
    return tags
  }

  async findSingleTag(input: GetTagInput & { owner: User['_id'] }) {
    // must be of owner, other searchfields optional
    return TagModel.findOne({ ...input }).lean()
  }

  /** Creates tags that do not exist yet and adjusts the input */
  async handleTagList(inputTags: CreateTagInput[], owner: User['_id']) {
    console.log('handleTagList', inputTags)

    const newTags = []
    for (const tag of inputTags) {
      // If no ID, we need to create tag
      const existingTag = await this.findSingleTag({ Id: tag.Id, owner: owner })

      const newTag = tag.Id === '' || !existingTag ? await this.createTag({ ...tag, owner: owner }) : existingTag

      newTags.push(newTag)
    }
    return newTags
  }
}

export default TagService
