import UserResolver from "./user.resolver"
import PieceResolver from "./piece.resolver"
import ThemeResolver from "./theme.resolver"

export const resolvers = [
    UserResolver, 
    PieceResolver, 
    ThemeResolver
] as const
