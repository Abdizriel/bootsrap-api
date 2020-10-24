import { Service } from 'typedi'

import { Account } from '@entities/Account'
import { Context } from '@internalTypes/Context'

@Service()
export class AccountController {
  constructor() {}

  public async currentAccount(ctx: Context): Promise<Account> {
    return ctx.account
  }
}
