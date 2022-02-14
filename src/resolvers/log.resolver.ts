import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreateLogInput, Log } from '../schema/log.schema'
import LogService from '../service/log.service'
import Context from '../types/context'

@Resolver()
export default class LogResolver {
  constructor(private logService: LogService) {
    this.logService = new LogService()
  }

  @Authorized()
  @Mutation(() => Boolean)
  destroyAllLogs() {
    return this.logService.destroyAllLogs()
  }
}
