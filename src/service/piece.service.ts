import { CreatePieceInput, GetPieceInput, PieceModel } from '../schema/piece.schema'
import TagService from '../service/tag.service'
import SlideService from '../service/slide.service'
import EdgeService from '../service/edge.service'
import { User } from '../schema/user.schema'
import { PIECE_EDGES } from '../types/message.label'

class PieceService {
  // Create complete document with filled 1:n relations for tags, slides
  async createPiece(input: CreatePieceInput & { user: User['_id'] }) {
    // Create tags, slides and the edges connecting them to the piece

    // Find tag: if it not exists -> create
    const tagService = new TagService()
    for (const tag of input.tags) {
      // If no ID, we need to create tag
      if (tag.tagId === '') {
        const nodeB = await tagService.createTag(tag)
        // set ID of tag in piece
        tag.tagId = nodeB._id
      }
    }

    // Add slides
    const slideService = new SlideService()
    for (const slide of input.slides) {
      // If no ID, we need to create slide
      if (slide.slideId === '') {
        const nodeB = await slideService.createSlide(slide)
        // set ID of tag in piece
        slide.slideId = nodeB._id
      }
    }

    const piece = await PieceModel.create(input)

    const edgeService = new EdgeService()
    // Create edges between tag(s) en piece
    for (const tag of input.tags) {
      const edge = edgeService.createEdge({ ...input, nodeA: piece._id, nodeB: tag.tagId, label: PIECE_EDGES.PIECE_TAG })
    }
    for (const slide of input.slides) {
      const edge = edgeService.createEdge({ ...input, nodeA: piece._id, nodeB: slide.slideId, label: PIECE_EDGES.PIECE_SLIDE })
    }

    return piece
  }

  async findPieces() {
    // Pagination login
    return PieceModel.find().lean()
  }

  async findSinglePiece(input: GetPieceInput) {
    return PieceModel.findOne(input).lean()
  }
}

export default PieceService
