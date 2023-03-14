import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import DatabaseService from '../service/database.service'
import { CreateUserInput } from '../schema/user.schema'

@Resolver()
export default class DatabaseResolver {
  constructor(private databaseService: DatabaseService) {
    this.databaseService = new DatabaseService()
  }

  @Mutation(() => Boolean)
  initDatabase(@Arg('input') input: CreateUserInput) {}
}
