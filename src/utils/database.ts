import mongoose from 'mongoose'
import config from 'config'

export async function connectToDatabase() {
  try {
    await mongoose.connect(config.get('dbUri'))
    console.log('Connected to Database')
  } catch (error) {
    console.error(error)
    // exit with statuscode 1 (something failed)
    process.exit(1)
  }
}
