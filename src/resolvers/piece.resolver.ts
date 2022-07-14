import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreatePieceInput, GetPieceInput, Piece } from '../schema/piece.schema'
import PieceService from '../service/piece.service'
import Context from '../types/context'

@Resolver()
export default class PieceResolver {
  // Dependency Injection?
  constructor(private pieceService: PieceService) {
    this.pieceService = new PieceService()
  }

  @Authorized() // uses AuthChecker (imported in schema in index.ts)
  @Mutation(() => Piece)
  createPiece(@Arg('input') input: CreatePieceInput, @Ctx() context: Context) {
    const user = context.user!
    return this.pieceService.createPiece({ ...input, owner: user._id })
  }

  @Authorized()
  @Query(() => [Piece])
  getPieces(@Ctx() context: Context) {
    const user = context.user!
    return this.pieceService.findUserPieces(user._id)
  }

  @Authorized()
  @Query(() => Piece)
  getPiece(@Arg('input') input: GetPieceInput, @Ctx() context: Context) {
    const user = context.user!
    return this.pieceService.findSingleUserPiece({ ...input, owner: user._id })
  }

  @Mutation(() => Boolean)
  destroyLoosePieceObjects() {
    console.log('piece resolver')
    return this.pieceService.destroyLoosePieceObjects()
  }

  @Authorized()
  @Mutation(() => Boolean)
  destroyUserPiece(@Arg('input') input: GetPieceInput, @Ctx() context: Context) {
    const user = context.user!
    return this.pieceService.destroyUserPiece({ ...input, owner: user._id })
  }
}
