import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
  ObjectType,
} from 'type-graphql';
import { MyContext } from '../types';
import { User } from '../entities/User';
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

// for Errors with a particular field
@ObjectType()
class FieldError {
  @Field()
  // something wrong with a specific field (like email or password, etc.)
  field: string;
  @Field()
  // message for what is actually wrong
  message: string;
}

@ObjectType()
class UserResponse {
  // set the type here, either field can be nullable
  @Field(() => [FieldError], { nullable: true })
  // ? means only return error if there was an error
  errors?: FieldError[];

  // ? means, return user if this works properly
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    // can pass one large object instead of multiple args
    // this already infers the type, but, to be thorough, have added () => UsernamePasswordInput for option
    @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    // validation for username
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username must be greater than two characters',
          },
        ],
      };
    }

    // validation for password
    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password must be greater than two characters',
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    // Save user to the db
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.code === '23505' || error.detail.includes('already exists')) {
        return {
          errors: [
            {
              field: 'username',
              message: 'username already exists',
            },
          ],
        };
      }

      // duplicate uesrname error
    }

    // return destructured user from UserResponse object if no issues with username / password validation
    return { user };
  }

  // Object types are returned in mutation decorator
  @Mutation(() => UserResponse)
  async login(
    @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    // lookup user by username and check to see if that user exists in db
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'that username does not exist',
          },
        ],
      };
    }
    // verify method, pass in hashed password and compare against plain text password.  Returns true or false
    // based on if they typed in the correct password
    const valid = await argon2.verify(user.password, options.password); // returns true or false
    // if its not a valid password, return some errors
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      };
    }
    // if we found a user and pw is correct, they have successfully logged in, no errors, return user
    return { user };
  }
}
