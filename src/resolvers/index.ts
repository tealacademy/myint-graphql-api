import UserResolver from './user.resolver'
import PieceResolver from './piece.resolver'
import ThemeResolver from './theme.resolver'
import ProfileResolver from './profile.resolver'
import TagResolver from './tag.resolver'
import LogResolver from './log.resolver'
import FrameResolver from './frame.resolver'
import FileResolver from './file.resolver'
import MessageResolver from './message.resolver'
import DatabaseResolver from './database.resolver'

export const resolvers = [
  UserResolver,
  PieceResolver,
  ThemeResolver,
  ProfileResolver,
  TagResolver,
  FrameResolver,
  LogResolver,
  FileResolver,
  MessageResolver,
  DatabaseResolver,
] as const
