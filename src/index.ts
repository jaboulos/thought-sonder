import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import mikroConfig from './mikro-orm.config';

// Create this function 'main' to resolve promises for the methods within.
const main = async () => {
  // Connect to db
  const orm = await MikroORM.init(mikroConfig);
  // Automatically run migrations
  await orm.getMigrator().up();

  // Run some sql - ex: Create a post
  // const post = orm.em.create(Post, { title: 'my first post' });

  // Insert post into table
  // await orm.em.persistAndFlush(post);

  // Get all posts and console log them
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

main().catch((err) => {
  console.error(err);
});
