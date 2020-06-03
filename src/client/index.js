import React from 'react';
import { hydrate } from 'react-dom';
import { preloadDynamicImports } from 'kyt-runtime/client';
import Root from './Root';
import { ApolloProvider } from 'react-apollo';
import client from './apollo';

preloadDynamicImports().then(() => {
  hydrate(
    <ApolloProvider client={client}>
      <Root />
    </ApolloProvider>,
    document.querySelector('#root'));
});

// enable Hot Module Replacement (HMR) via Webpack polling
if (module.hot) module.hot.accept();
