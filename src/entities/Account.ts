import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

@ObjectType()
@Entity({ name: 'accounts' })
@Unique(['id'])
export class Account extends BaseEntity {
  // Columns
  @Field(_ => ID)
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Field(_ => String)
  @Column({
    type: 'text',
  })
  public slug: string

  @Field(_ => String)
  @Column({
    type: 'text',
  })
  public username: string

  @Field(_ => String)
  @Column({
    type: 'text',
  })
  public email: string

  @Column({
    type: 'text',
  })
  public password: string

  @Column({
    type: 'bool',
    name: 'is_active',
    default: true,
  })
  public isActive: boolean

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
  public static seed = async (records?: Partial<Account>[]): Promise<void> => {
    if (!records) {
      records = []
    }

    await Account.insert(records)
  }
}
