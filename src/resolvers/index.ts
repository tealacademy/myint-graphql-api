import UserResolver from './user.resolver'
import PieceResolver from './piece.resolver'
import ThemeResolver from './theme.resolver'
import ProfileResolver from './profile.resolver'
import TagResolver from './tag.resolver'
import LogResolver from './log.resolver'
import FrameResolver from './frame.resolver'

export const resolvers = [UserResolver, PieceResolver, ThemeResolver, ProfileResolver, TagResolver, FrameResolver, LogResolver] as const
