import { CreateEdgeInput, GetEdgeInput, EdgeModel, Edge } from '../schema/edge.schema'
import { User } from '../schema/user.schema'

class EdgeService {
  async createEdge(input: CreateEdgeInput) {
    return EdgeModel.create(input)
  }

  async findEdges(input: GetEdgeInput): Promise<Edge[]> {
    return EdgeModel.find(input).lean()
  }

  async findSingleEdge(input: GetEdgeInput) {
    return EdgeModel.findOne(input).lean()
  }

  async destroyEdges(input: GetEdgeInput) {
    return EdgeModel.deleteMany(input)
  }

  async destroyLooseEdges(input: GetEdgeInput) {
    return EdgeModel.deleteMany(input)
  }
}

export default EdgeService
