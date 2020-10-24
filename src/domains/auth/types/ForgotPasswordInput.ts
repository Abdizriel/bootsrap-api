import { Field, InputType } from 'type-graphql'

@InputType()
export class ForgotPasswordInput {
  @Field(_ => String)
  public username: string
}
