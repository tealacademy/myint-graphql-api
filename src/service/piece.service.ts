import {
  CreatePieceInput,
  GetPieceInput,
  PieceModel,
} from "../schema/piece.schema";
import { User } from "../schema/user.schema";

class ProductService {
  async createProduct(input: CreatePieceInput & { user: User["_id"] }) {
    return PieceModel.create(input);
  }

  async findProducts() {
    // Pagination login
    return PieceModel.find().lean();
  }

  async findSingleProduct(input: GetPieceInput) {
    return PieceModel.findOne(input).lean();
  }
}

export default ProductService;
