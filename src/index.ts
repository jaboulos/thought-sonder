import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import microConfig from './mikro-orm.config';
import express from 'express';

import { __prod__ } from './constants';
// import { Post } from './entities/Post';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';

// Create this function 'main' to resolve promises for the methods within.
const main = async () => {
  // Connect to db
  const orm = await MikroORM.init(microConfig);
  // Automatically run migrations
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    // pass in gql schema
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    // Special object that is accessible by all resolvers
    // A function that returns an object for the context
    context: () => ({ em: orm.em }),
  });

  // create gql endpoint on express
  apolloServer.applyMiddleware({ app });

  // app.get('/', (_, res) => {
  //   res.send('sup');
  // });

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });
};

main().catch((err) => {
  console.error(err);
});
