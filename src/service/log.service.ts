import { CreateLogInput, LogModel } from '../schema/log.schema'
import EdgeService from '../service/edge.service'
import { User } from '../schema/user.schema'
import { LOG_EDGES } from '../types/enums'

class LogService {
  async createLog(input: CreateLogInput, user: User, label: string) {
    const newLog = await LogModel.create(input)

    const logEdge = new EdgeService().createEdge({ nodeA: user._id, nodeB: newLog.id, label: label })
    return newLog
  }

  async findLogs() {
    return LogModel.find().lean()
  }

  async destroyAllLogs() {
    console.log('Destroying all logs')
    new EdgeService().destroyEdges({
      label: LOG_EDGES.USER_LOG_ITEM,
    })
    return LogModel.deleteMany()
  }
}

export default LogService
