import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import { Post } from '../entities/Post';
import { MyContext } from 'src/types';

@Resolver()
export class PostResolver {
  // GET all
  @Query(() => [Post]) // Setting gql type
  // Type checking on resolver, setting TS type
  posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    // Query and return everything from db
    return ctx.em.find(Post, {});
  }

  // GET ONE
  // ctx is NOT destructured here (1st example, 2nd example with destructure on CREATE)
  @Query(() => Post, { nullable: true })
  post(
    @Arg('id') id: number,
    @Ctx() ctx: MyContext
    // unions in TS
  ): Promise<Post | null> {
    return ctx.em.findOne(Post, { id });
  }

  // CREATE
  // ctx is destructured here
  @Mutation(() => Post) // return a post after creating one
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  // UPDATE
  @Mutation(() => Post, { nullable: true }) // return a post after creating one or null
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> /* Set TS type here */ {
    // Fetch post
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== 'undefined') {
      post.title = title;
      // Update post
      await em.persistAndFlush(post);
    }
    return post;
  }

  // DELETE
  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Post, { id });
    } catch {
      return false;
    }
    return true;
  }
}
