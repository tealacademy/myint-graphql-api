import { CreatePieceInput, GetPieceInput, UpdatePieceInput, PieceModel, PieceVersionEdgeModel } from '../schema/piece.schema'
import TagService from '../service/tag.service'
import { User } from '../schema/user.schema'
import { PIECE_EDGES } from '../types/data'
import { applyChangeset } from '../utils/json-diff-ts/jsonDiff'

class PieceService {
  /** Create complete document with filled 1:n relations for tags, slides
   */
  async createPiece(input: CreatePieceInput & { owner: User['_id'] }) {
    console.log('create piece')
    const updateVersion = 0
    const pieceVersion = 1

    // Tags are created in UI and can only be added to piece if they exist in model

    // No need to create slide-objects. Are nested documents.
    // Keys are set in UI
    const piece = await PieceModel.create({ ...input, updateVersion, pieceVersion })

    // Edge between piece and owner
    const edge = await PieceVersionEdgeModel.create({ ...input, nodeA: piece._id, nodeB: input.owner, label: PIECE_EDGES.PIECE_CREATE })

    return piece
  }

  async updatePiece(input: UpdatePieceInput & { owner: User['_id'] }) {
    console.log('update piece')
    const piece = await PieceModel.findOne({ _id: input.Id, owner: input.owner }).lean()

    if (!piece) return

    // If piece is not updated by some other client
    if (piece.updateVersion === input.currentVersion) {
      // get latest versionEdge for versionnumber and raise it
      const edgeVersion = piece.updateVersion + 1

      // update piece-document
      applyChangeset(piece, input.delta)

      // Edge between piece and update
      const edge = await PieceVersionEdgeModel.create({
        ...input,
        oldPiece: piece._id,
        newPiece: piece._id,
        delta: input.delta,
        version: edgeVersion,
        owner: input.owner,
        label: PIECE_EDGES.PIECE_UPDATE,
      })

      // ! check onderstaande
      // Return updated latest version from database
      return PieceModel.updateOne({ ...piece, updateVersion: edgeVersion }, { $set: { updatedAt: Date.now() } }).lean()
    }

    // Return (not updated by this call) latest version from database
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
  // async destroyUserPiece(input: GetPieceInput & { owner: User['_id'] }) {
  // const edgeService = new EdgeService()

  // edgeService.destroyEdges({ nodeA: input.Id, label: PIECE_EDGES.PIECE_OWNER })

  // // ? Do we need to delete tags that have no edges anymore?
  // edgeService.destroyEdges({ nodeA: input.Id, label: PIECE_EDGES.PIECE_TAG })

  // // Destroy all slides of this piece
  // const edges = await edgeService.findEdges({ nodeA: input.Id, label: PIECE_EDGES.PIECE_SLIDE })
  // for (const edge of edges) {
  //   if (edge.nodeB) new SlideService().destroySlide({ Id: edge.nodeB.toString() })
  //   edgeService.destroyEdges({ Id: edge._id })
  // }

  // const result = await PieceModel.deleteOne({ _id: input.Id, owner: input.owner })

  // return result.deletedCount > 0
  // }

  /**
   *  Destroys all edges and slides that are not linked to a piece
   */
  // async destroyLoosePieceObjects() {
  //   const edgeService = new EdgeService()

  //   // Look for all edges that have nodeA as piece._id
  //   const pieceEdges = (await edgeService.findEdges({ label: PIECE_EDGES.PIECE_OWNER }))
  //     .concat(await edgeService.findEdges({ label: PIECE_EDGES.PIECE_SLIDE }))
  //     .concat(await edgeService.findEdges({ label: PIECE_EDGES.PIECE_TAG }))

  //   // console.log('destroyLoosePieceObjects', pieceEdges)
  //   for (const edge of pieceEdges) {
  //     if (!(await PieceModel.exists({ _id: edge.nodeA }))) {
  //       if (edge.nodeA) edgeService.destroyEdges({ Id: edge.nodeA.toString() })
  //     }
  //   }

  //   // Slides

  //   return true
  // }
}
// {$or: [{ label: PIECE_EDGES.PIECE_OWNER }, { label: PIECE_EDGES.PIECE_SLIDE }, { label: PIECE_EDGES.PIECE_TAG }]}

export default PieceService
