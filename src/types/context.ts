import { Request, Response } from 'express'
import { User } from '../schema/user.schema'

export interface Context {
  req: Request
  res: Response
  user: contextUser | null
}

export interface contextUser {
  Id: string
  roles: string[]
}
