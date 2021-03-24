import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

// Can stack decorators ~~ this is an ObjectType AND and Entity
// Like a db table
@ObjectType()
@Entity()
export class Post {
  // These are columns in a table
  @Field() // Field decorator exposes this to gql schema
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() }) // hook that creates a date anytime theres an update
  updatedAt = new Date();

  @Field()
  @Property({ type: 'text' })
  title!: string;
}
