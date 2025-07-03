export const generateHashedIdentifierFromParams = (...args: (string | number)[]): string => {
  const baseString = args.join('_');
  let hash = 0;

  for (let i = 0; i < baseString.length; i++) {
    hash = (hash << 5) - hash + baseString.charCodeAt(i);
    hash |= 0;
  }

  return 'm' + Math.abs(hash).toString(36).slice(0, 10);
};
