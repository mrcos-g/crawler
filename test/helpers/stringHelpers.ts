export const positionAfterProtocol = (url: string) => {
  const doubleSlashIndex = url.indexOf("//");
  if (doubleSlashIndex === -1) return -1;
  return doubleSlashIndex + 2;
};
