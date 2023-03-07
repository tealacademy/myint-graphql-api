import {
  Piece,
  CreatePieceInput,
  GetPieceInput,
  GetPieceListInput,
  UpdatePieceInput,
  ReleasePieceInput,
  PieceModel,
  PieceVersionEdgeModel,
  PieceVersionEdge,
} from '../schema/piece.schema'
import TagService from '../service/tag.service'
import { User } from '../schema/user.schema'
import { PIECE_EDGES, ERROR_MESSAGES } from '../types/data'
import { applyChangeset, revertChangeset } from '../utils/json-diff-ts/jsonDiff'
import { Number } from 'mongoose'

PieceModel.schema.methods.aaa = function () {
  console.log('test')
}
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

  /** */
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
      // Find Piece to update
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

  /**
   * If no owner defined: give all pieces of given updateVersion and releaseVersion
   * If no releaseVersion defined: give all pieces of latest releaseVersion and given updateVersion and owner
   * If no updateVersion defined of given owner and releaseVersion: give latest updateVersion
   * @param input
   * @returns
   */
  async findPieces(input: GetPieceListInput & { owner: User['_id'] }) {
    // Should return latest release

    try {
      const pieceVersionQuery = input.pieceVersion ? 'pieceVersion: input.pieceVersion' : ''
      const newPieces: Piece[] = []
      // If we want the piece with the highest versionnumber. We do not need to check the highest pieceVersion
      // because we always have the latest version in the PieceModel
      const pieces: Piece[] = !input.pieceVersion
        ? await PieceModel.find({ owner: input.owner, pieceVersionQuery }, { $max: '$pieceVersion' }).lean()
        : await PieceModel.find({ owner: input.owner, pieceVersion: input.pieceVersion }).lean()

      for (let i = 0; i < pieces.length; i++) {
        const newPiece = await this.givePieceUpdateVersion(pieces[i], input.updateVersion ? input.updateVersion : null)
        newPieces.concat(newPiece)
      }

      return newPieces
    } catch (error) {
      console.log(error)
      throw new Error('piece.service.findUserPieces: ' + ERROR_MESSAGES.PIECE_QUERY + ': ' + input.owner)
    }
  }

  /**
   * Generates the requested update of a certain release of a piece
   * @param piece: the piece
   * @param updateVersion: which version of the update is requested
   * @returns: the generated update of the Piece
   */
  async givePieceUpdateVersion(piece: Piece, updateVersion: number | null) {
    // If updateVersion = null, we request the latest update
    if (updateVersion === null) return piece

    try {
      // Find edges met updates (both piece._id's are same) of specific release
      // and sort them descending so we start with latest update
      const edges: PieceVersionEdge[] = await PieceVersionEdgeModel.find({ oldPiece: piece._id, newPiece: piece._id }, { $sort: { version: -1 } })

      for (let i2 = 0; i2 < edges.length; i2++) {
        // The next edge should have same updateVersion als piece, otherwise there is an error
        if (edges[i2].version !== piece.updateVersion) {
          throw new Error('piece.service.givePieceUpdateVersion: ' + ERROR_MESSAGES.PIECE_UPDATEVERSION + ': ' + piece._id)
        }
        // We need to revert until we reached the requested updateVersion
        else if (updateVersion && piece.updateVersion > updateVersion) {
          revertChangeset(piece, edges[i2].delta)
        } else break
      }

      return piece
    } catch (error) {
      console.log(error)
      throw new Error('piece.service.givePieceUpdateVersion: ' + ERROR_MESSAGES.PIECE_FIND + ': ' + piece._id)
    }
  }

  /**
   *  Finds a single piece of a user
   */
  async findSinglePiece(input: GetPieceInput & { owner: User['_id'] }) {
    try {
      const piece: Piece = !input.pieceVersion
        ? await PieceModel.findOne({ _id: input.Id }).lean()
        : await PieceModel.findOne({ _id: input.Id, pieceVersion: input.pieceVersion }).lean()

      const updatePiece = await this.givePieceUpdateVersion(piece, input.updateVersion ? input.updateVersion : null)

      return updatePiece
    } catch (error) {
      console.log(error)
      throw new Error('piece.service.findSinglePiece: ' + ERROR_MESSAGES.PIECE_QUERY + ': ' + input.Id)
    }
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
