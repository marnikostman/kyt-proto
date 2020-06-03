import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const GET_ARTICLES = gql`
  query GET_ARTICLES {
    articles {
      id
      title
      reads
    }
  }
`;

export default () => (
  <Query query={GET_ARTICLES}>
    {({ loading, data }) => !loading && (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Reads</th>
          </tr>
        </thead>
        <tbody>
          {data.articles.map(article => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.reads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </Query>
);
