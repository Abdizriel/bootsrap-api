import { Request } from 'express'
import { ContainerInstance } from 'typedi'

import { Account } from '@entities/Account'

export interface Context {
  account: Account
  req: Request
  requestId: string | number
  container: ContainerInstance
}
