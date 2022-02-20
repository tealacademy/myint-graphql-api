import { CreateFrameInput, GetFrameInput, FrameModel } from '../schema/frame.schema'
import TagService from './tag.service'
import ChallengeService from './challenge.service'
import MyinTSetService from './myintset.service'
import ClueService from './clue.service'
import EdgeService from './edge.service'
import { User } from '../schema/user.schema'
import { FRAME_EDGES, CHALLENGE_EDGES } from '../types/message.label'

class FrameService {
  /** Create complete document with filled 1:n relations for tags, clues
   */
  async createFrame(input: CreateFrameInput & { owner: User['_id'] }) {
    // Create tags, clues,  and the edges connecting them to the frame
    console.log('create frame')

    const newTags = await new TagService().handleTagList(input.tags, input.owner)
    // //const slideService = new SlideService()
    const newClues = input.clues ? await new ClueService().handleClueList(input.clues) : []

    const newChallenge = input.challenge
      ? input.challenge.Id === ''
        ? await new ChallengeService().createChallenge(input.challenge)
        : await new ChallengeService().findSingleChallenge({ Id: input.challenge.Id })
      : undefined

    const newMyinTSet = input.myinTSet
      ? input.myinTSet.Id === ''
        ? await new MyinTSetService().createMyinTSet(input.myinTSet)
        : await new MyinTSetService().findSingleMyinTSet({ Id: input.myinTSet.Id })
      : undefined

    const frame = await FrameModel.create({ ...input, tags: newTags, clues: newClues, challenge: newChallenge, myintset: newMyinTSet })
    // put new frame in challenge

    const edgeService = new EdgeService()
    // // Edge between frame and owner
    const edge = edgeService.createEdge({ ...input, nodeA: frame._id, nodeB: input.owner, label: FRAME_EDGES.FRAME_OWNER })
    if (newChallenge) {
      const edgeChallenge = edgeService.createEdge({ ...input, nodeA: newChallenge._id, nodeB: frame._id, label: CHALLENGE_EDGES.CHALLENGE_FRAME })
    }
    if (newMyinTSet) {
      const edgeChallenge = edgeService.createEdge({ ...input, nodeA: frame._id, nodeB: newMyinTSet._id, label: FRAME_EDGES.FRAME_MYINTSET })
    }

    for (const tag of newTags) {
      const edge = edgeService.createEdge({ ...input, nodeA: frame._id, nodeB: tag._id, label: FRAME_EDGES.FRAME_TAG })
    }
    for (const clue of newClues) {
      const edge = edgeService.createEdge({ ...input, nodeA: frame._id, nodeB: clue._id, label: FRAME_EDGES.FRAME_CLUE })
    }

    // console.log('new frame', frame)

    return frame
  }

  async findUserFrames(userId: string) {
    const frames = await FrameModel.find({ owner: userId }).lean()

    return frames
  }

  async findSingleFrame(input: GetFrameInput & { owner: User['_id'] }) {
    const frame = FrameModel.findOne({ owner: input.owner }).lean()

    return frame
  }
}

export default FrameService
