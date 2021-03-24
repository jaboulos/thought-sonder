import { Box } from '@chakra-ui/react';
import React from 'react';

interface WrapperProps {
  variant?: 'small' | 'regular';
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'regular',
}) => {
  return (
    // Box element in chakra is kind of like a div, can style as i see fit
    <Box
      mt={8}
      mx='auto'
      maxW={variant === 'regular' ? '800px' : '400px'}
      w='100%'
    >
      {children}
    </Box>
  );
};
