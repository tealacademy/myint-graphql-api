import { Piece, CreatePieceInput, GetPieceInput, UpdatePieceInput, ReleasePieceInput, PieceModel, PieceVersionEdgeModel } from '../schema/piece.schema'
import TagService from '../service/tag.service'
import { User } from '../schema/user.schema'
import { PIECE_EDGES, ERROR_MESSAGES } from '../types/data'
import { applyChangeset } from '../utils/json-diff-ts/jsonDiff'

class PieceService {
  /** Create complete document with filled tags, slides
   * Tags must exist in db
   */
  async createPiece(input: CreatePieceInput & { owner: User['_id'] }, pieceVersion: number) {
    console.log('Service: createPiece')

    // New piece is never updated before
    const updateVersion = 0

    try {
      // check if tags in piece exist. They are no references to existing Tags in Model so we need to check ourselves
      const { tags } = input

      if (tags !== undefined) {
        const tagService = new TagService()
        if (!tagService.checkTags(tags, input.owner)) throw new Error('piece.service.createPiece: ' + ERROR_MESSAGES.PIECE_TAGS + ': ' + input.tags)
      }

      const piece = await PieceModel.create({ ...input, updateVersion, pieceVersion })

      return piece
    } catch (error) {
      console.log(error)
      throw new Error('piece.service.createPiece: ' + ERROR_MESSAGES.PIECE_CREATE + ': ' + input.title)
    }
  }

  async copyPiece(piece: Piece, owner: User['_id'], pieceVersion: number) {
    console.log('Service: copyPiece')

    // New piece is never updated before
    const updateVersion = 0

    try {
      // ! Kan dit of nodig? Door destructuring het id eruit halen. Krijgt het nieuwe Piece een uniek ID?
      const { _id, ...clonePiece } = piece
      const copyPiece = await PieceModel.create({ ...clonePiece, owner, updateVersion, pieceVersion })

      // TODO: if new owner we need new tag(s) for this piece because they are personal

      return copyPiece
    } catch (error) {
      console.log(error)
      throw new Error('piece.service.copyPiece: ' + ERROR_MESSAGES.PIECE_COPY + ': ' + piece._id)
    }
  }

  /**
   * Tags are created in UI and can only be added to piece if they are created through API and exist in model
   * @param input
   * @returns
   */
  async updatePiece(input: UpdatePieceInput & { owner: User['_id'] }) {
    console.log('Service: updatePiece')

    try {
      // Find Piece to update
      const piece = await PieceModel.findOne({ _id: input.Id, owner: input.owner }).lean()

      // If piece does not exist or is not updated by some other client
      if (piece && piece.updateVersion === input.currentVersion) {
        // get latest versionEdge for versionnumber and raise it
        const edgeVersion = piece.updateVersion + 1

        // update piece-document
        applyChangeset(piece, input.delta)

        // Edge between piece and updated piece (update in delta)
        const edge = await PieceVersionEdgeModel.create({
          ...input,
          oldPiece: piece._id,
          newPiece: piece._id,
          delta: input.delta,
          version: edgeVersion,
          owner: input.owner,
          label: PIECE_EDGES.PIECE_VERSION_UPDATE,
        })

        // ! test onderstaande
        // Return updated latest version from database
        return PieceModel.updateOne({ ...piece, updateVersion: edgeVersion }, { $set: { updatedAt: Date.now() } }).lean()
      } else throw new Error('piece.service.updatePiece: ' + ERROR_MESSAGES.PIECE_FIND + ': ' + input.Id)

      // Return (not updated by this call) latest version from database
      // otherwise null
      return piece
    } catch (error) {
      console.log(error)
      throw new Error('piece.service.updatePiece: ' + ERROR_MESSAGES.PIECE_UPDATE + ': ' + input.Id)
    }
  }

  /**
   * Tags are created in UI and can only be added to piece if they are created through API and exist in model
   * @param input
   * @returns
   */
  async releasePiece(input: ReleasePieceInput & { owner: User['_id'] }) {
    console.log('Service: releaseePiece')

    // initialise new Piece
    let newPiece = null

    try {
      // if PieceId does not exist, we need to create a new piece
      const piece = await PieceModel.findOne({ _id: input.Id, owner: input.owner }).lean()

      // If piece is not updated by some other client
      if (piece && piece.updateVersion === input.currentVersion) {
        // New piece has updateVersion = 0
        const edgeVersion = 0

        // update piece-document
        applyChangeset(piece, input.delta)

        // Make copy of this piece
        newPiece = await this.copyPiece(piece, input.owner, 1)

        // Edge between piece and updated piece (update in delta)
        const edge = await PieceVersionEdgeModel.create({
          ...input,
          oldPiece: piece._id,
          newPiece: newPiece._id,
          delta: input.delta,
          version: newPiece.updateVersion,
          owner: input.owner,
          label: PIECE_EDGES.PIECE_VERSION_RELEASE,
        })
      } else throw new Error('piece.service.releasePiece: ' + ERROR_MESSAGES.PIECE_FIND + ': ' + input.Id)

      // Return (not updated by this call) latest version from database
      // otherwise null
      return newPiece
    } catch (error) {
      console.log(error)
      throw new Error('piece.service.releasePiece: ' + ERROR_MESSAGES.PIECE_RELEASE + ': ' + input.Id)
    }
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
