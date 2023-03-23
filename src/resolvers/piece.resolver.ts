import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreatePieceInput, GetPieceInput, GetPieceListInput, Piece } from '../schema/piece.schema'
import PieceService from '../service/piece.service'
import { Context } from '../types/context'

@Resolver()
export default class PieceResolver {
  // Dependency Injection?
  constructor(private pieceService: PieceService) {
    this.pieceService = new PieceService()
  }

  @Authorized() // uses AuthChecker (imported in schema in index.ts), has args: roles, roletype
  @Mutation(() => Piece)
  createPiece(@Arg('input') input: CreatePieceInput, @Ctx() context: Context) {
    const user = context.user!
    return this.pieceService.createPiece({ ...input, owner: user.Id }, 1)
  }

  @Authorized()
  @Query(() => [Piece])
  getPieces(@Arg('input') input: GetPieceListInput, @Ctx() context: Context) {
    const user = context.user!

    // If no owner in input, we use user
    // If owner in input, then piece from that owner
    const ownerId = input.owner ? input.owner : user.Id
    const { owner, ...newInput } = input
    return this.pieceService.findPieces({ ...newInput, owner: ownerId })
  }

  @Authorized()
  @Query(() => Piece)
  getPiece(@Arg('input') input: GetPieceInput, @Ctx() context: Context) {
    const user = context.user!

    const ownerId = input.owner ? input.owner : user.Id
    const { owner, ...newInput } = input
    return this.pieceService.findSinglePiece({ ...input, owner: ownerId })
  }

  // @Mutation(() => Boolean)
  // destroyLoosePieceObjects() {
  //   console.log('piece resolver')
  //   return this.pieceService.destroyLoosePieceObjects()
  // }

  // @Authorized()
  // @Mutation(() => Boolean)
  // destroyUserPiece(@Arg('input') input: GetPieceInput, @Ctx() context: Context) {
  //   const user = context.user!
  //   return this.pieceService.destroyUserPiece({ ...input, owner: user._id })
  // }
}
