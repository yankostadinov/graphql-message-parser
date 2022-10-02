import {
  checkIsSelectingField,
  extractEmoticons,
  extractLinks,
  extractMentions,
} from './utils.js';

const root = {
  parsedMessage: async (args, _, info) => {
    const selections = info.fieldNodes.find(
      node => node.name.value === 'parsedMessage',
    ).selectionSet.selections;

    return {
      mentions:
        checkIsSelectingField(selections, 'mentions') &&
        extractMentions(args.message),
      emoticons:
        checkIsSelectingField(selections, 'emoticons') &&
        extractEmoticons(args.message),
      links:
        checkIsSelectingField(selections, 'links') &&
        (await extractLinks(args.message)),
    };
  },
};

export default root;
