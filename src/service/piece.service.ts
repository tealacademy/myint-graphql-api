import {
  CreatePieceInput,
  GetPieceInput,
  PieceModel,
} from "../schema/piece.schema"
import { User } from "../schema/user.schema"

class PieceService {
  // async createPiece(input: CreatePieceInput ) {
    async createPiece(input: CreatePieceInput & { user: User["_id"] }) {
    return PieceModel.create(input)
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
