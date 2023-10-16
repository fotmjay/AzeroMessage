export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000).toLocaleString();
  return date;
};
