import { Field, InputType, ClassType } from 'type-graphql'

export default function OrderBy<TItem>(_TItemClass: ClassType<TItem>) {
  @InputType({ isAbstract: true })
  abstract class OrderByClass {
    @Field(_ => String)
    public key: keyof TItem

    @Field()
    public order: 'ASC' | 'DESC'
  }
  return OrderByClass
}
