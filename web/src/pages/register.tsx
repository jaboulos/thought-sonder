import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';

import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useMutation } from 'urql';

interface registerProps {}

// From GQL playground
const REGISTER_MUT = `
mutation Register($username:String!, $password:String!){
  register(options: { username: $username, password: $password }) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
`;

export const Register: React.FC<registerProps> = ({}) => {
  // urql hook
  // first item in array is some info about whats going on about the mutation, if not passing anything in, just leave as empty obj or put a comma
  // second item in array is our function, can name it anything
  const [, register] = useMutation(REGISTER_MUT);
  return (
    <Wrapper variant='small'>
      {/* initial state of form */}
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          console.log(values);
          // the values line up (username === username, so can just leave in as values, otherwise may look like this ex: ({username: values.user})) 2:38
          // This is a promise, need to add a return so that it is returned once the promise resolves
          return register(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              label='Username'
              placeholder='username'
            />
            <Box mt={4}>
              <InputField
                name='password'
                label='Password'
                placeholder='password'
                type='password'
              />
            </Box>
            <Button
              mt={4}
              colorScheme='teal'
              isLoading={isSubmitting}
              type='submit'
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
