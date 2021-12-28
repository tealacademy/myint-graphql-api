import UserResolver from "./user.resolver"
import PieceResolver from "./piece.resolver"

export const resolvers = [UserResolver, PieceResolver] as const
