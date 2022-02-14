import { CreateFrameInput, GetFrameInput, FrameModel } from '../schema/frame.schema'
import TagService from './tag.service'
import ClueService from './clue.service'
import EdgeService from './edge.service'
import { User } from '../schema/user.schema'
import { FRAME_EDGES } from '../types/message.label'

class FrameService {
  /** Create complete document with filled 1:n relations for tags, clues
   */
  async createFrame(input: CreateFrameInput & { owner: User['_id'] }) {
    // Create tags, clues,  and the edges connecting them to the frame
    console.log('create frame')

    const newTags = await new TagService().handleTagList(input.tags, input.owner)
    // //const slideService = new SlideService()
    const newClues = await new ClueService().handleClueList(input.clues)

    const frame = await FrameModel.create({ ...input }) //, challenge:  })

    const edgeService = new EdgeService()
    // // Edge between frame and owner
    // const edge = edgeService.createEdge({ ...input, nodeA: frame._id, nodeB: input.owner, label: PIECE_EDGES.PIECE_OWNER })
    // // When piedeId is known create edges between tag(s) en frame
    for (const tag of newTags) {
      const edge = edgeService.createEdge({ ...input, nodeA: frame._id, nodeB: tag._id, label: FRAME_EDGES.FRAME_TAG })
    }
    // for (const slide of newSlides) {
    //   const edge = edgeService.createEdge({ ...input, nodeA: frame._id, nodeB: slide._id, label: PIECE_EDGES.PIECE_SLIDE })
    // }

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
