import jwt from 'jsonwebtoken'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Account } from '@entities/Account'
import { Token } from '@entities/Token'

@Service()
export class TokenRepository {
  constructor(@InjectRepository(Token) private readonly tokenRepository: Repository<Token>) {}

  public async create(account: Account, payload: any): Promise<Token> {
    const existingEntry = await this.getByAccount(account)
    if (existingEntry) {
      await this.remove(existingEntry)
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    })

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    })

    const entry = new Token()
    entry.accessToken = accessToken
    entry.refreshToken = refreshToken
    entry.account = account

    return this.tokenRepository.save(entry)
  }

  private getByAccount(account: Account): Promise<Token | undefined> {
    return this.tokenRepository.findOne({ account, isDeleted: false })
  }

  private remove(token: Token): Promise<Token> {
    return this.tokenRepository.remove(token)
  }
}
