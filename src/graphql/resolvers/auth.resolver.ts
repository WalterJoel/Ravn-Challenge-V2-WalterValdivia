/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Request, RequestHandler } from 'express'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'
import { TextEncoder } from 'util'
import { SignJWT, jwtVerify } from 'jose'
import {AuthenticationError} from 'apollo-server-express'
 


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "Ravn Challenge Secret Key Token"

const orm = new PrismaClient()

/**
 * This function takes in a user's email and password, checks if the user exists, 
   * Only if user exists and if the password is valid, it signs a JWT token with the user's information,
   * role, and id, and returns the token and the user
 * @param req 
 * @param res 
 * @param next continue with the stack of Express
 */
export const signIn: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body

  try {
    /* Using shorthand-object in parameter for email */ 
    const user = await orm.user.findUnique({ where: { email} })
    if (!user) {
      throw new AuthenticationError('User not found')
    }

    const isValid = await compare(password, user.password)

    if (!isValid) {
      throw new AuthenticationError('Incorrect password')
    }
    /* Signing Token with id, email and role user */
    const token = await new SignJWT({id:user.id, email:user.email, roles:user.roles})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(new TextEncoder().encode(JWT_SECRET_KEY))

    res.json({ token, username: user.email, id: user.id })
  } catch (err) {
    res.sendStatus(401)
  }
}

export const verifyToken = async (req: Request) => {
  const { authorization } = req.headers
  const token = (authorization || '').replace('Bearer ', '')

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET_KEY)
    )
    return verified.payload
  } catch (e) {
    throw new Error('Invalid token')
  }
}

/**
 * This function is used by express like middleware to verify in each request if a user is authenticated
 */
const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const payload = await verifyToken(req)
    req.user = { id:payload.id, email:payload.email, roles:payload.roles}
  } catch (e) {
    // ignore
  } finally {
    next()
  }
}

/* By default export authMiddleware */
export default authMiddleware
