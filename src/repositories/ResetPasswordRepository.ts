import crypto from 'crypto'
import moment from 'moment'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Account } from '@entities/Account'
import { ResetPassword } from '@entities/ResetPassword'

@Service()
export class ResetPasswordRepository {
  constructor(
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
  ) {}

  public async getById(id: string) {
    return this.resetPasswordRepository.findOne({ id, isDeleted: false })
  }

  public async create(account: Account) {
    const existingEntry = await this.getByAccount(account)

    if (existingEntry) {
      this.remove(existingEntry)
    }

    const token = crypto.randomBytes(32).toString('hex')

    const entry = new ResetPassword()
    entry.account = account
    entry.token = token
    entry.expireAt = moment
      .utc()
      .add(1, 'd')
      .toDate()

    return this.resetPasswordRepository.save(entry)
  }

  public async getTokenAccount(token: string): Promise<Account | undefined> {
    const entry = await this.resetPasswordRepository.findOne({ token, isDeleted: false })
    return entry.account
  }

  public async getByToken(token: string): Promise<ResetPassword | undefined> {
    return this.resetPasswordRepository.findOne({ token, isDeleted: false })
  }

  private async getByAccount(account: Account): Promise<ResetPassword | undefined> {
    return this.resetPasswordRepository.findOne({ account, isDeleted: false })
  }

  private async remove(token: ResetPassword): Promise<ResetPassword> {
    return this.resetPasswordRepository.remove(token)
  }
}
