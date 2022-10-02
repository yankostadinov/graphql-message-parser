import fetch from 'node-fetch';

export const extractMentions = message => message.match(/@\w+/g) || [];
export const extractEmoticons = message => message.match(/\(\w+\)/g) || [];

export const getTitleFromURL = async url => {
  const body = await fetch(url).then(res => res.text());
  const title = body.match(/<title>([^<]*)<\/title>/)[1];

  return title || '';
};
export const parseLink = async link => ({
  url: link,
  title: await getTitleFromURL(link),
});
export const extractLinks = async message => {
  const links =
    message.match(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
    ) || [];

  const parsedLinks = await Promise.all(links.map(parseLink));

  return parsedLinks;
};

export const checkIsSelectingField = (selections, fieldName) =>
  selections.some(selection => selection.name.value === fieldName);
