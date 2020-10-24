import slugify from 'slugify'
import { Service } from 'typedi'
import { Repository, UpdateResult } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Account } from '@entities/Account'

@Service()
export class AccountRepository {
  constructor(@InjectRepository(Account) private readonly accountRepository: Repository<Account>) {}

  public async create(data: Partial<Account>): Promise<Account> {
    const entry = new Account()
    entry.email = data.email
    entry.password = data.password
    entry.username = data.username
    entry.slug = slugify(data.username, {
      lower: true,
      strict: true,
    })

    return this.accountRepository.save(entry)
  }

  public async patch(id: string, data: Partial<Account>): Promise<UpdateResult> {
    return this.accountRepository.update(id, data)
  }

  public async getById(id: string): Promise<Account | undefined> {
    return this.accountRepository.findOne({ id, isDeleted: false })
  }

  public async getByUsername(username: string): Promise<Account | undefined> {
    return this.accountRepository.findOne({ username, isDeleted: false })
  }

  public async getByEmail(email: string): Promise<Account | undefined> {
    return this.accountRepository.findOne({ email, isDeleted: false })
  }

  public async getByUsernameOrEmail(
    username: string,
    email?: string,
  ): Promise<Account | undefined> {
    if (username && email) {
      return this.accountRepository.findOne({
        where: [
          {
            username,
          },
          {
            email,
          },
        ],
      })
    } else {
      return this.accountRepository.findOne({
        where: [
          {
            username,
          },
          {
            email: username,
          },
        ],
      })
    }
  }
}
