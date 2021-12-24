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
  constructor(private pieceService: PieceService) {
    this.pieceService = new PieceService();
  }

  @Authorized()
  @Mutation(() => Piece)
  createPiece(
    @Arg("input") input: CreatePieceInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.pieceService.createPiece({ ...input, user: user?._id });
  }

  @Query(() => [Piece])
  products() {
    return this.pieceService.findPieces();
  }

  @Query(() => Piece)
  product(@Arg("input") input: GetPieceInput) {
    return this.pieceService.findSinglePiece(input);
  }
}
