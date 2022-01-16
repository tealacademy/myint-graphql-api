import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreatePieceInput, GetPieceInput, Piece } from '../schema/piece.schema'
import PieceService from '../service/piece.service'
import Context from '../types/context'

@Resolver()
export default class PieceResolver {
  constructor(private pieceService: PieceService) {
    this.pieceService = new PieceService()
  }

  @Authorized() // uses AuthChecker (imported in schema in index.ts)
  @Mutation(() => Piece)
  createPiece(@Arg('input') input: CreatePieceInput, @Ctx() context: Context) {
    const user = context.user!
    return this.pieceService.createPiece({ ...input, user: user?._id })
  }

  @Query(() => [Piece])
  pieces() {
    return this.pieceService.findPieces()
  }

  @Query(() => Piece)
  piece(@Arg('input') input: GetPieceInput, @Ctx() context: Context) {
    return this.pieceService.findSinglePiece(input)
  }
}
