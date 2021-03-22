import { User } from 'src/entities/User';
import { MyContext } from 'src/types';
import { Resolver, Mutation, InputType, Field, Arg, Ctx } from 'type-graphql';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

// schema that is a single query 'hello()'
@Resolver()
export class UserResolver {
  @Mutation(() => String)
  async register(
    // can pass one large object instead of multiple args
    @Arg('options') options: UsernamePasswordInput
    @Ctx() {em}: MyContext
  ) {
    // Save user to the db
    const user = em.create(User, {username: options.username})
    await em.persistAndFlush(user)
    return 'hi';
  }
}
