import { ClassType, Field, ObjectType, Int } from 'type-graphql'

export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(_ => [TItemClass])
    public items: TItem[]

    @Field(_ => Int)
    public total: number

    @Field()
    public hasMore: boolean
  }
  return PaginatedResponseClass
}
