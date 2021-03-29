import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { Provider, createClient } from 'urql';

// point to GQL server
const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    // This will send a cookie, need this for getting a cookie when we register or login
    credentials: 'include',
  },
});

import theme from '../theme';

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
