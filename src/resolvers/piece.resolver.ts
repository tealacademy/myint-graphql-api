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
    this.pieceService = new PieceService()
  }

  // @Authorized()
  @Mutation(() => Piece)
  createPiece(
    @Arg("input") input: CreatePieceInput,
    @Ctx() context: Context
  ) {
    const user = context.user!
    return this.pieceService.createPiece({ ...input, user: user?._id })

    // create tag

    // create edge tussen tag en piece


    console.log("input", input)
    // return this.pieceService.createPiece({ ...input })
  }

  @Query(() => [Piece])
  pieces() {
    return this.pieceService.findPieces()
  }

  @Query(() => Piece)
  piece(@Arg("input") input: GetPieceInput,
  @Ctx() context: Context) {
  
  //   const context = (ctx: Context) => {
  //   console.log(ctx.req.body)
  //   return ctx
  // }
  // context2 = context(Context.req)

// if (context2.req.operationName !== 'IntrospectionQuery') {
  
    console.log("find piece ", input, context.req.body.query)
    return this.pieceService.findSinglePiece(input)
  }
}
