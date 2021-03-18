import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import mikroConfig from './mikro-orm.config';

// Create this function 'main' to resolve promises for the methods within.
const main = async () => {
  const orm = await MikroORM.init(mikroConfig);

  // Create a post
  const post = orm.em.create(Post, { title: 'my first post' });
  // Insert post into db
  await orm.em.persistAndFlush(post);
};

main().catch((err) => {
  console.error(err);
});
