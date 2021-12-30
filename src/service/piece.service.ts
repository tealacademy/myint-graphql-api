import {
  CreatePieceInput,
  GetPieceInput,
  PieceModel,
} from "../schema/piece.schema"
import TagService from "../service/tag.service"
import SlideService from "../service/slide.service"
import EdgeService from "../service/edge.service"
import { User } from "../schema/user.schema"

class PieceService {
    async createPiece(input: CreatePieceInput & { user: User["_id"] }) {
      // Now create tags, slides and the edges connecting them to the piece
      
      // Find tag: if it not exists -> create
      const tagService = new TagService()
      for (const tag of input.tags) {
        // If no ID, we need to create tag
        if (tag.tagID === "") {
          const nodeB = await tagService.createTag(tag)
          // set ID of tag in piece
          tag.tagID = nodeB._id
        }
      }

      // Add slides
      const slideService = new SlideService()
      for (const slide of input.slides) {
        // If no ID, we need to create tag
        if (slide.slideID === "") {
          const nodeB = await slideService.createSlide(slide)
          // set ID of tag in piece
          slide.slideID = nodeB._id
        }
      }

      const piece = await PieceModel.create(input)

      const edgeService = new EdgeService()
      // Create edges between tag(s) en piece
      for (const tag of input.tags) {
        const edge = edgeService.createEdge({ ...input, nodeA: piece._id, nodeB: tag.tagID , label: "piece_tag"})
      }
      for (const slide of input.slides) {
        const edge = edgeService.createEdge({ ...input, nodeA: piece._id, nodeB: slide.slideID , label: "piece_slide"})
      }
      console.log('pieceservice, tags changed?', input)
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
