import fetch from 'node-fetch';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Link {
    url: String
    title: String
  }
  type ParsedMessage {
    mentions: [String]
    emoticons: [String]
    links: [Link]
  }
  type Query {
    parsedMessage(message: String!): ParsedMessage
  }
`);

const extractMentions = message => message.match(/@\w+/g) || [];
const extractEmoticons = message => message.match(/\(\w+\)/g) || [];
const extractLinks = async message => {
  const links =
    message.match(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
    ) || [];

  const parsedLinks = await Promise.all(
    links.map(async link => {
      const body = await fetch(link).then(res => res.text());
      const title = body.match(/<title>([^<]*)<\/title>/)[1] || '';

      return { url: link, title: title };
    }),
  );

  return parsedLinks;
};

const root = {
  parsedMessage: async (args, _, info) => {
    const selections = info.fieldNodes.find(
      node => node.name.value === 'parsedMessage',
    ).selectionSet.selections;
    const selectingMentions = selections.some(
      selection => selection.name.value === 'mentions',
    );
    const selectingEmoticons = selections.some(
      selection => selection.name.value === 'emoticons',
    );
    const selectingLinks = selections.some(
      selection => selection.name.value === 'links',
    );
    return {
      mentions: selectingMentions && extractMentions(args.message),
      emoticons: selectingEmoticons && extractEmoticons(args.message),
      links: selectingLinks && (await extractLinks(args.message)),
    };
  },
};

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: process.env.NODE_ENV === 'development',
  }),
);
app.listen(9000);
console.log('Running server at http://localhost:9000/graphql');
