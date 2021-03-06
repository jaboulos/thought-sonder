import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/core';

import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  // urql hook
  // first item in array is some info about whats going on about the mutation, if not passing anything in, just leave as empty obj or put a comma
  // second item in array is our function, can name it anything
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant='small'>
      {/* initial state of form */}
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          if (response.data?.register.errors) {
            // if theres an error
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // successfully registered, navigate to home page
            router.push('/');
          }
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
              variantColor='teal'
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
