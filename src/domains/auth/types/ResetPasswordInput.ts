import { Field, InputType } from 'type-graphql'

@InputType()
export class ResetPasswordInput {
  @Field(_ => String)
  public password: string

  @Field(_ => String)
  public token: string
}
