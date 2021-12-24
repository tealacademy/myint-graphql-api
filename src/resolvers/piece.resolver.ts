import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql"
import {
  CreatePieceInput,
  GetPieceInput,
  Piece,
} from "../schema/piece.schema"
import PieceService from "../service/piece.service"
import Context from "../types/context"

@Resolver()
export default class PieceResolver {
  constructor(private productService: PieceService) {
    this.productService = new PieceService();
  }

  @Authorized()
  @Mutation(() => Piece)
  createProduct(
    @Arg("input") input: CreatePieceInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.productService.createProduct({ ...input, user: user?._id });
  }

  @Query(() => [Piece])
  products() {
    return this.productService.findProducts();
  }

  @Query(() => Piece)
  product(@Arg("input") input: GetPieceInput) {
    return this.productService.findSingleProduct(input);
  }
}
