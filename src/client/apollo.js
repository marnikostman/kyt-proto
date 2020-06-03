// import 'cross-fetch/polyfill';
// import ApolloClient from 'apollo-client';
// import { HttpLink } from 'apollo-link-http';
//
// const link = new HttpLink({ uri: 'http://localhost:3000/graphql' });
//
// export const client = new ApolloClient({link});

import ApolloClient from 'apollo-boost';
import { InMemoryCache } from "apollo-cache-inmemory";

export default new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache()
});
