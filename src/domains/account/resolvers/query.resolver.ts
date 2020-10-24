import { ApolloError } from 'apollo-server-lambda'
import { Authorized, Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { Account } from '@entities/Account'
import { Context } from '@internalTypes/Context'

import { AccountController } from '../AccountController'

@Service()
@Resolver()
export class QueryResolver {
  constructor(private authController: AccountController) {}

  @Authorized()
  @Query(_ => Account)
  public async currentAccount(@Ctx() ctx: Context) {
    try {
      return this.authController.currentAccount(ctx)
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }
}
