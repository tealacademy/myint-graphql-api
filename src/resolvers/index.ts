import UserResolver from './user.resolver'
import PieceResolver from './piece.resolver'
import ThemeResolver from './theme.resolver'
import ProfileResolver from './profile.resolver'

export const resolvers = [UserResolver, PieceResolver, ThemeResolver, ProfileResolver] as const
