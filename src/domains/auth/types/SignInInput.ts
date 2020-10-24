import { Field, InputType } from 'type-graphql'

@InputType()
export class SignInInput {
  @Field(_ => String)
  public username: string

  @Field(_ => String)
  public password: string
}
