import { CreateLogInput, LogModel } from '../schema/log.schema'
import EdgeService from '../service/edge.service'
import { User } from '../schema/user.schema'

class LogService {
  async createLog(input: CreateLogInput, user: User, label: string) {
    const newLog = LogModel.create(input)

    const logEdge = new EdgeService().createEdge({ nodeA: user._id, nodeB: (await newLog).id, label: label })
    return newLog
  }

  async findLogs() {
    return LogModel.find().lean()
  }
}

export default LogService
