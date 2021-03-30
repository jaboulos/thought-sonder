import { ThemeProvider, CSSReset } from '@chakra-ui/core';
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

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
