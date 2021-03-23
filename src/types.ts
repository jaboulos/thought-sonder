import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Request, Response } from 'express';

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: Express.Session }; // current version of express doesnt have session for some reason, add this version instead <yarn add -D @types/express-session@1.15.16>
  res: Response;
};
