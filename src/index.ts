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
import { UserResolver } from './resolvers/user';

import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

// Create this function 'main' to resolve promises for the methods within.
const main = async () => {
  // Connect to db
  const orm = await MikroORM.init(microConfig);
  // Automatically run migrations
  await orm.getMigrator().up();

  const app = express();
  // connect to redis
  // this is run before the apollo server runs, important to have this order because session middleware will be used inside of apollo
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: 'qid', // name of the cookie
      store: new RedisStore({
        client: redisClient,
        // add options for redis store, disableTouch keeps the session going forever
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true, // cannot access cookie from FE
        sameSite: 'lax', // protects csrf
        secure: __prod__, // cookie only works in https.  Can set it to false if having trouble
      },
      saveUninitialized: false,
      secret: 'asdfasdf', // want to make this secret an env variable eventually
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    // pass in gql schema
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    // Special object that is accessible by all resolvers
    // A function that returns an object for the context
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  // create gql endpoint on express
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });
};

main().catch((err) => {
  console.error(err);
});
