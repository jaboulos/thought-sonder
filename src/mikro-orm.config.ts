import path from 'path';
import { MikroORM } from '@mikro-orm/core';

import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';

// Can access this info from the mikroORM cli
export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations.  Path creates absolute path and joins these two file paths
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files.  [tj]s allows ts and js files.
  },
  entities: [Post, User], // Corresponds to all db tables
  dbName: 'lireddit',
  user: 'postgres',
  password: 'password',
  type: 'postgresql',
  debug: !__prod__, // Logs what sql is being executed underneath the hood.  Helpful for debugging.
  // MikroORM is a function and I'm giving it the type of function...Parameters returns an array, so give it first item in array
  // doing this so the 'const orm = await MikroORM.init(mikroConfig);' line in index.ts stops complaining
} as Parameters<typeof MikroORM.init>[0]; // Put a type in the brackets and it will tell you all the parameters for it
