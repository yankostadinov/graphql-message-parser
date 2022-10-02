import {
  extractEmoticons,
  extractLinks,
  extractMentions,
  getTitleFromURL,
} from './utils.js';

const root = {
  parsedMessage: {
    mentions: (_, __, info) => {
      return extractMentions(info.variableValues.message);
    },
    emoticons: (_, __, info) => {
      return extractEmoticons(info.variableValues.message);
    },
    links: (_, __, info) => {
      const shouldFetchTitles = info.fieldNodes[0].selectionSet.selections.some(
        selection => selection.name.value === 'title',
      );

      const links = extractLinks(info.variableValues.message);

      return links.map(async link => ({
        url: link,
        title: shouldFetchTitles ? await getTitleFromURL(link) : '',
      }));
    },
  },
};

export default root;
