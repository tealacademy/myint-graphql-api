import { CreateChallengeInput, GetChallengeInput, ChallengeModel } from '../schema/challenge.schema'
import { EdgeModel } from '../schema/edge.schema'

class ChallengeService {
  async createChallenge(input: CreateChallengeInput) {
    return ChallengeModel.create(input)
  }

  async findChallenges() {
    return ChallengeModel.find().lean()
  }

  async findSingleChallenge(input: GetChallengeInput) {
    ChallengeModel.findOne(input).lean()
    return ChallengeModel.findOne(input).lean()
  }
}

export default ChallengeService
