import { CreatePieceInput, GetPieceInput, PieceModel, Piece } from '../schema/piece.schema'
import TagService from '../service/tag.service'
import SlideService from '../service/slide.service'
import EdgeService from '../service/edge.service'
import { User } from '../schema/user.schema'
import { PIECE_EDGES } from '../types/message.label'

class PieceService {
  /** Create complete document with filled 1:n relations for tags, slides
   */
  async createPiece(input: CreatePieceInput & { owner: User['_id'] }) {
    // Create tags, slides and the edges connecting them to the piece
    console.log('create piece')

    //const tagService = new TagService()
    const newTags = await new TagService().handleTagList(input.tags, input.owner)

    // Add slides
    const newSlides = await new SlideService().handleSlideList(input.slides)

    const piece = await PieceModel.create({ ...input, tags: newTags, slides: newSlides })

    const edgeService = new EdgeService()
    // Edge between piece and owner
    const edge = edgeService.createEdge({ ...input, nodeA: piece._id, nodeB: input.owner, label: PIECE_EDGES.PIECE_OWNER })
    // When piedeId is known create edges between tag(s) en piece
    for (const tag of newTags) {
      const edge = edgeService.createEdge({ ...input, nodeA: piece._id, nodeB: tag._id, label: PIECE_EDGES.PIECE_TAG })
    }
    for (const slide of newSlides) {
      const edge = edgeService.createEdge({ ...input, nodeA: piece._id, nodeB: slide._id, label: PIECE_EDGES.PIECE_SLIDE })
    }

    return piece
  }

  async findUserPieces(owner: User['_id']) {
    const pieces = await PieceModel.find({ owner: owner }).lean()

    return pieces
  }

  /**
   *  Finds a single piece of a user
   */
  async findSingleUserPiece(input: GetPieceInput & { owner: User['_id'] }) {
    const piece = PieceModel.findOne({ _id: input.Id, owner: input.owner }).lean()

    return piece
  }

  /**
   *  Destroys a single piece of a user
   */
  async deleteUserPiece(input: GetPieceInput & { owner: User['_id'] }) {
    const piece = PieceModel.updateOne({ _id: input.Id, owner: input.owner }, { $set: { deleted: Date.now() } })

    return piece
  }

  /**
   *  Destroys a single piece of a user
   */
  async destroyUserPiece(input: GetPieceInput & { owner: User['_id'] }) {
    const edgeService = new EdgeService()

    edgeService.destroyEdges({ nodeA: input.Id, label: PIECE_EDGES.PIECE_OWNER })

    // ? Do we need to delete tags that have no edges anymore?
    edgeService.destroyEdges({ nodeA: input.Id, label: PIECE_EDGES.PIECE_TAG })

    // Destroy all slides of this piece
    const edges = await edgeService.findEdges({ nodeA: input.Id, label: PIECE_EDGES.PIECE_SLIDE })
    for (const edge of edges) {
      if (edge.nodeB) new SlideService().destroySlide({ Id: edge.nodeB.toString() })
      edgeService.destroyEdges({ Id: edge._id })
    }

    const result = await PieceModel.deleteOne({ _id: input.Id, owner: input.owner })

    return result.deletedCount > 0
  }

  /**
   *  Destroys all edges and slides that are not linked to a piece
   */
  async destroyLoosePieceObjects() {
    const edgeService = new EdgeService()

    // Look for all edges that have nodeA as piece._id
    const pieceEdges = (await edgeService.findEdges({ label: PIECE_EDGES.PIECE_OWNER }))
      .concat(await edgeService.findEdges({ label: PIECE_EDGES.PIECE_SLIDE }))
      .concat(await edgeService.findEdges({ label: PIECE_EDGES.PIECE_TAG }))

    // console.log('destroyLoosePieceObjects', pieceEdges)
    for (const edge of pieceEdges) {
      if (!(await PieceModel.exists({ _id: edge.nodeA }))) {
        if (edge.nodeA) edgeService.destroyEdges({ Id: edge.nodeA.toString() })
      }
    }

    // Slides

    return true
  }
}
// {$or: [{ label: PIECE_EDGES.PIECE_OWNER }, { label: PIECE_EDGES.PIECE_SLIDE }, { label: PIECE_EDGES.PIECE_TAG }]}

export default PieceService
