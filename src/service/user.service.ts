import dotenv from 'dotenv'
dotenv.config()
import { omit, pick } from 'lodash'
import { ApolloError } from 'apollo-server-errors'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { CreateUserInput, LoginInput, UserModel, User } from '../schema/user.schema'
import EdgeService from '../service/edge.service'
import ProfileService from '../service/profile.service'
import Context from '../types/context'
import { signJwt } from '../utils/jwt'
import jwt from 'jsonwebtoken'
import config from 'config'
import nodemailer from 'nodemailer'
import LogService from './log.service'
import { LOG_EDGES, USER_EDGES, LOG_ACTIONS, ERROR_MESSAGES } from '../types/message.label'
const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf'
class UserService {
  async createUser(input: CreateUserInput) {
    console.log('createUser')

    // creating a new profile (for now)
    // later it must be possible to create a new user based on an existing profile.
    const newProfile = await new ProfileService().createProfile({ ...input.profile })
    console.log(newProfile)

    // Create user with encrypted password
    const confirmToken = nanoid(32)
    const newUser = await UserModel.create({ ...input, profile: newProfile, confirmToken })
    console.log(newUser)

    const createEdge = new EdgeService().createEdge({ nodeA: newUser._id, nodeB: newProfile.id, label: USER_EDGES.USER_PROFILE })

    const dataString = JSON.stringify(`{confirmToken: ${confirmToken}`)
    const newLog = new LogService().createLog({ action: LOG_ACTIONS.CREATE_USER, data: dataString }, newUser, LOG_EDGES.USER_LOG_ITEM)

    return newUser
  }

  async registerUser(input: CreateUserInput) {
    console.log('registerUser')
    const result = await this.createUser(input)

    // sendConfirmToken
    jwt.sign(
      {
        user: result.id,
        confirmToken: result.confirmToken,
      },
      EMAIL_SECRET, // SECRET-KEY to encrypt
      {
        expiresIn: '1d',
      },
      (err, emailToken) => {
        const url = `http://localhost:${config.get('serverPort')}/confirmation/${emailToken}`
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        })
        transporter.sendMail({
          from: `MyinT <${process.env.EMAIL_USER}>`,
          to: `${result.profile.firstName} <${result.eMail}>`,
          subject: 'Activate your MyinT',
          html: `Please click this link to activate your MyinT: <a href="${url}">${url}</a>`,
        })
      }
    )
    const dataString = JSON.stringify(`{to: ${result.profile.firstName} <${result.eMail}>`)
    const newLog = new LogService().createLog({ action: LOG_ACTIONS.REGISTER_USER, data: dataString }, result, LOG_EDGES.USER_LOG_ITEM)

    return result
  }

  async confirmUser(token: string) {
    try {
      type userId = { id: string; confirmToken: string; iat: number; exp: number }
      const userid = jwt.verify(token, EMAIL_SECRET) as userId

      // find our user
      const user = await UserModel.findOne(userid)
      if (!user || user.confirmToken !== userid.confirmToken) {
        throw new Error()
      }
      // Change active to true
      user.active = true
      // Save the user
      await user.save()

      const dataString = JSON.stringify(`{confirmToken: ${user.confirmToken}}`)
      const newLog = new LogService().createLog({ action: LOG_ACTIONS.CONFIRM_USER, data: dataString }, user, LOG_EDGES.USER_LOG_ITEM)

      return user
    } catch (e) {
      throw new Error(ERROR_MESSAGES.EMAIL_CONFIRM_INCORRECT)
    }
  }

  async login(input: LoginInput, context: Context) {
    // Get our user by email. lean means we don't need to use any of the methods on this user
    const user = await UserModel.find().findByEmail(input.eMail)

    if (!user) {
      throw new ApolloError(ERROR_MESSAGES.EMAIL_PASSWORD_INCORRECT)
    }

    // validate the password
    const passwordIsValid = await bcrypt.compare(input.passWord, user.passWord)

    if (!passwordIsValid) {
      throw new ApolloError(ERROR_MESSAGES.EMAIL_PASSWORD_INCORRECT)
    }

    if (!user.active) {
      throw new ApolloError(ERROR_MESSAGES.CONFIRM_EMAIL)
    }

    // sign a jwt
    const token = signJwt(omit(user.toJSON(), ['passWord', 'active']))

    const dataString = JSON.stringify(`{accessToken: ${token}}`)
    const newLog = new LogService().createLog({ action: LOG_ACTIONS.LOGIN_USER, data: dataString }, user, LOG_EDGES.USER_LOG_ITEM)

    // return the jwt-token
    return token
  }

  async logout(context: Context) {
    // not necessary? can be handled on client-side
    // by throwing out accesstoken

    if (context.user) {
      const newLog = new LogService().createLog({ action: LOG_ACTIONS.LOGOUT_USER, data: '' }, context.user, LOG_EDGES.USER_LOG_ITEM)
    }
    return null
  }
}

export default UserService
