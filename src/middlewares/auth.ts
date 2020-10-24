import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { Account } from '@entities/Account'

export async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const Authorization = req.get('Authorization')

  if (!Authorization) {
    ;(req as any).account = null
    next()
    return
  }

  const token = Authorization.replace('Bearer ', '')

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      ;(req as any).account = null
      next()
      return
    }

    ;(req as any).account = await Account.findOne({ id: (decoded as any).id })
    next()
  })
}
