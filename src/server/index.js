import express from 'express';
import compression from 'compression';
import path from 'path';
import React from 'react';
const cors = require('cors');
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { preloadDynamicImports, DynamicImports, getBundles } from 'kyt-runtime/server';
import { extractCritical } from 'pretty-lights/server';
import template from './template';
import App from '../components/App';

const ARTICLES = [
  { title: "Coronavirus", reads: 2000000 },
  { title: "Elections", reads: 3000000 },
];

const schema = buildASTSchema(gql`
  type Query {
    articles: [Article]
    article(id: ID!): Article
  }

  type Article {
    id: ID
    title: String
    reads: Int
  }
`);

const mapArticle = (article, id) => article && ({ id, ...article });

const root = {
  articles: ({readCount}) => ARTICLES.map(mapArticle),
  article: ({ id }) => mapArticle(ARTICLES[id], id),
};

const port = parseInt(KYT.SERVER_PORT, 10);
const app = express();
app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

// Remove annoying Express header addition.
app.disable('x-powered-by');

// Compress (gzip) assets in production.
app.use(compression());

// Setup the public directory so that we can server static assets.
app.use(express.static(path.join(process.cwd(), KYT.PUBLIC_DIR)));

// Setup server side routing.
app.get('*', (req, res) => {
  const context = {};
  const modules = [];

  const { html, ids, css } = extractCritical(
    renderToString(
      <DynamicImports report={moduleName => modules.push(moduleName)}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
      </DynamicImports>
    )
  );

  if (context.status && context.status.code) {
    let message = context.status.message || 'Error!';
    if (!context.status.message && Number(context.status.code) === 404) {
      message = 'Not found';
    }
    res.status(context.status.code).send(message);
  } else if (context.redirect && context.redirect.url) {
    res.redirect(context.redirect.code || 302, context.redirect.url);
  }

  res.status(200).send(
    template({
      html,
      ids,
      css,
      bundles: getBundles({ modules }),
    })
  );
});

preloadDynamicImports().then(() => {
  app.listen(port, () => {
    console.log(`✅  server started on port: ${port}`); // eslint-disable-line no-console
  });
});
