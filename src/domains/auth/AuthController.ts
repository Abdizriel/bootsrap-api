import { ApolloError } from 'apollo-server-lambda'
import bcrypt from 'bcrypt'
import isNil from 'lodash/isNil'
import { Service } from 'typedi'

import { AppLogger } from '@config/Logger'
import { Context } from '@internalTypes/Context'
import { AccountRepository } from '@repositories/AccountRepository'
import { ResetPasswordRepository } from '@repositories/ResetPasswordRepository'
import { TokenRepository } from '@repositories/TokenRepository'

import { AuthenticationResponse } from './types/AuthenticationResponse'
import { ForgotPasswordInput } from './types/ForgotPasswordInput'
import { ForgotPasswordResponse } from './types/ForgotPasswordResponse'
import { ResetPasswordInput } from './types/ResetPasswordInput'
import { SignInInput } from './types/SignInInput'
import { SignUpInput } from './types/SignUpInput'

@Service()
export class AuthController {
  constructor(
    private accountRepository: AccountRepository,
    private tokenRepository: TokenRepository,
    private resetPasswordRepository: ResetPasswordRepository,
  ) {}

  public async accountExist(_ctx: Context, username: string, email?: string): Promise<boolean> {
    try {
      const account = await this.accountRepository.getByUsernameOrEmail(username, email)
      return !isNil(account)
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }

  public async signIn(_ctx: Context, input: SignInInput): Promise<AuthenticationResponse> {
    try {
      const { username, password } = input
      const account = await this.accountRepository.getByUsernameOrEmail(username)
      const validPassword = await bcrypt.compare(password, account.password)

      if (!validPassword) {
        AppLogger.info(`Log in attempt by ${username}`)
        throw new ApolloError('Password does not match.')
      }

      const jwtPayload = {
        id: account.id,
        username: account.username,
        email: account.email,
      }

      const token = await this.tokenRepository.create(account, jwtPayload)

      return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }

  // TODO: Add email sending
  public async signUp(_ctx: Context, input: SignUpInput): Promise<AuthenticationResponse> {
    try {
      const hashedPassword = await bcrypt.hash(input.password, 13)
      const account = await this.accountRepository.create({
        ...input,
        password: hashedPassword,
      })

      const jwtPayload = {
        id: account.id,
        username: account.username,
        email: account.email,
      }

      const token = await this.tokenRepository.create(account, jwtPayload)

      return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }

  // TODO: Add email sending
  public async forgotPassword(
    _ctx: Context,
    input: ForgotPasswordInput,
  ): Promise<ForgotPasswordResponse> {
    try {
      const { username } = input
      const account = await this.accountRepository.getByUsernameOrEmail(username)
      const resetPassword = await this.resetPasswordRepository.create(account)
      const link = `${process.env.WEB_URL}/auth/reset-password?=token${resetPassword.token}`

      return {
        status: 'ok',
        link,
      }
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }

  public async isValidResetToken(_ctx: Context, token: string): Promise<boolean> {
    try {
      const entry = await this.resetPasswordRepository.getByToken(token)
      return !isNil(entry)
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }

  public async resetPassword(
    _ctx: Context,
    input: ResetPasswordInput,
  ): Promise<AuthenticationResponse> {
    try {
      const { token: resetToken, password } = input
      const hashedPassword = await bcrypt.hash(password, 13)
      let account = await this.resetPasswordRepository.getTokenAccount(resetToken)

      await this.accountRepository.patch(account.id, {
        password: hashedPassword,
      })
      account = await this.accountRepository.getById(account.id)

      const jwtPayload = {
        id: account.id,
        username: account.username,
        email: account.email,
      }

      const token = await this.tokenRepository.create(account, jwtPayload)

      return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }
}
