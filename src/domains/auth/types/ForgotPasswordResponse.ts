import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ForgotPasswordResponse {
  @Field(_ => String)
  public status: string

  @Field(_ => String)
  public link: string
}
