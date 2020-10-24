import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Unique,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'

import { Account } from './Account'
import { Lazy } from '../types/Lazy'

@ObjectType()
@Entity({ name: 'reset_passwords' })
@Unique(['id'])
export class ResetPassword extends BaseEntity {
  // Columns
  @Field(_ => ID)
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Field(_ => String)
  @Column({
    type: 'text',
  })
  public token: string

  @Field(_ => Account)
  @OneToOne(_ => Account, { lazy: true })
  @JoinColumn()
  public account: Lazy<Account>

  @Field(_ => Date)
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'expire_at',
  })
  public expireAt: Date

  @Field(_ => Date)
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
  })
  public createdAt: Date

  @Field(_ => Date, { nullable: true })
  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
    nullable: true,
  })
  public updatedAt: Date | null

  @Field(_ => Boolean)
  @Column({
    type: 'bool',
    default: false,
    name: 'is_delete',
  })
  public isDeleted: boolean

  // Seeds
  public static seed = async (records?: Partial<ResetPassword>[]): Promise<void> => {
    if (!records) {
      records = []
    }

    await ResetPassword.insert(records)
  }
}
