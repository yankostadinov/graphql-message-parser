import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import root from './src/resolvers.js';
import schema from './src/schema.js';

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
);
const PORT = 9000;
app.listen(PORT);
console.log(`Running server at http://localhost:${PORT}/graphql`);
