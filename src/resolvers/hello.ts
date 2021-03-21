import { Resolver, Query } from 'type-graphql';

// schema that is a single query 'hello()'
@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello() {
    return 'hi';
  }
}
