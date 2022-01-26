import { CreateEdgeInput, GetEdgeInput, EdgeModel } from '../schema/edge.schema'
import { User } from '../schema/user.schema'

class EdgeService {
  async createEdge(input: CreateEdgeInput) {
    return EdgeModel.create(input)
  }

  // async findEdges(input: GetNodeAEdgesInput) {
  //   // Pagination login
  //   return EdgeModel.find().lean()
  // }

  async findSingleEdge(input: GetEdgeInput) {
    return EdgeModel.findOne(input).lean()
  }
}

export default EdgeService
