import mongoose from 'mongoose'
import config from 'config'
import { UserModel } from '../schema/user.schema'
import { ThemeModel } from '../schema/theme.schema'

/**
 * The DatabaseService performs administrative tasks on the database:
 * - deleting the whole database
 * - initialising the inital user: admin-user + group + roles
 * - initialising default settings: Piece-theme
 */
class DatabaseService {
  async connect() {
    try {
      console.log('Connecting to database')
      await mongoose.connect(config.get('dbUri'))
      console.log('Connected to Database')

      // check if database is initialised with admin-user?
    } catch (error) {
      console.error(error)
      // exit with statuscode 1 (something failed)
      process.exit(1)
    }
  }

  async init(input: any) {
    // create admin
    // create default Piece Theme
  }

  async initDefaultTheme(input: any) {}
}

export default DatabaseService
