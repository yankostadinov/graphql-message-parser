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

export default schema;