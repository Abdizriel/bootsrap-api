import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class AuthenticationResponse {
  @Field(_ => String)
  public accessToken: string

  @Field(_ => String)
  public refreshToken: string
}
