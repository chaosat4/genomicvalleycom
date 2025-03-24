import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://cms.genomicvalley.in/graphql',  
  cache: new InMemoryCache(),
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`
  }
});

export default client;