import { ApolloError } from 'apollo-server-lambda'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { AuthenticationResponse } from '../types/AuthenticationResponse'
import { ForgotPasswordInput } from '../types/ForgotPasswordInput'
import { ForgotPasswordResponse } from '../types/ForgotPasswordResponse'
import { ResetPasswordInput } from '../types/ResetPasswordInput'
import { SignInInput } from '../types/SignInInput'
import { SignUpInput } from '../types/SignUpInput'

import { AuthController } from '../AuthController'

import { Context } from '@internalTypes/Context'

@Service()
@Resolver()
export class MutationResolver {
  constructor(private authController: AuthController) {}

  @Mutation(_ => AuthenticationResponse)
  public async signIn(@Ctx() ctx: Context, @Arg('input') input: SignInInput) {
    try {
      const isExisting = await this.authController.accountExist(ctx, input.username)
      if (!isExisting) {
        throw new ApolloError('Account with username or email not exists')
      }

      return this.authController.signIn(ctx, input)
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }

  @Mutation(_ => AuthenticationResponse)
  public async signUp(@Ctx() ctx: Context, @Arg('input') input: SignUpInput) {
    try {
      const isExisting = await this.authController.accountExist(ctx, input.username, input.email)
      if (isExisting) {
        throw new ApolloError('Account with username or email already exists')
      }

      return this.authController.signUp(ctx, input)
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }

  @Mutation(_ => ForgotPasswordResponse)
  public async forgotPassword(@Ctx() ctx: Context, @Arg('input') input: ForgotPasswordInput) {
    try {
      const isExisting = await this.authController.accountExist(ctx, input.username)
      if (!isExisting) {
        throw new ApolloError('Account with username or email not exists')
      }

      return this.authController.forgotPassword(ctx, input)
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }

  @Mutation(_ => AuthenticationResponse)
  public async resetPassword(@Ctx() ctx: Context, @Arg('input') input: ResetPasswordInput) {
    try {
      const isValid = await this.authController.isValidResetToken(ctx, input.token)
      if (!isValid) {
        throw new ApolloError('Invalid or expired reset token')
      }

      return await this.authController.resetPassword(ctx, input)
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }
}
