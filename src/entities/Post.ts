import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

// Corresponds to a db table
@Entity()
export class Post {
  // These decorators correspond to columns
  @PrimaryKey()
  id!: number;

  @Property({ type: 'date' })
  createdAt = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() }) // hook that creates a date anytime theres an update
  updatedAt = new Date();

  @Property({ type: 'text' })
  title!: string;
}
