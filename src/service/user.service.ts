import dotenv from 'dotenv'
dotenv.config()
import { omit, pick } from 'lodash'
import { ApolloError } from 'apollo-server-errors'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { CreateUserInput, LoginInput, UserModel, User } from '../schema/user.schema'
import { ProfileModel } from '../schema/profile.schema'
import EdgeService from '../service/edge.service'
import ProfileService from '../service/profile.service'
import Context from '../types/context'
import { signJwt } from '../utils/jwt'
import jwt from 'jsonwebtoken'
import config from 'config'
import { CookieOptions } from 'express'
import nodemailer from 'nodemailer'

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

    // const edgeService = new EdgeService()
    const newEdge = new EdgeService().createEdge({ ...input, nodeA: newUser._id, nodeB: newProfile.id, label: 'user_profile' })

    console.log(newEdge)
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
          to: `${result.profile.firstname} <${result.email}>`,
          subject: 'Activate your MyinT',
          html: `Please click this link to activate your MyinT: <a href="${url}">${url}</a>`,
        })
      }
    )
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

      // return user
      return user
    } catch (e) {
      throw new Error('Email or confirm token are incorrect')
    }
  }

  async login(input: LoginInput, context: Context) {
    // Get our user by email. lean means we don't need to use any of the methods on this user
    const user = await UserModel.find().findByEmail(input.email)

    if (!user) {
      throw new ApolloError('Invalid email-address or password')
    }

    // validate the password
    const passwordIsValid = await bcrypt.compare(input.password, user.password)

    if (!passwordIsValid) {
      throw new ApolloError('Invalid email-address or password')
    }

    if (!user.active) {
      throw new ApolloError('Please confirm your email-address')
    }

    // sign a jwt
    const token = signJwt(omit(user.toJSON(), ['password', 'active']))

    // return the jwt-token
    return token
  }

  async logout(context: Context) {
    // not necessary? can be handled on client-side
    // by throwing out accesstoken
    // context.res.cookie('accessToken', '', { ...cookieOptions, maxAge: 0 })

    return null
  }
}

export default UserService
