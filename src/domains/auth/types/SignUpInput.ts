import { Field, InputType } from 'type-graphql'

@InputType()
export class SignUpInput {
  @Field(_ => String)
  public username: string

  @Field(_ => String)
  public email: string

  @Field(_ => String)
  public password: string
}
