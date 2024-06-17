export const formatDate = (timestamp: string) => {
  const target = Number(timestamp);

  const curTime = Date.now() / 1000;
  const res = curTime - target;

  if (res < 60) {
    return `${res.toFixed(0)} seconds ago`;
  } else if (res < 60 * 60) {
    return `${(res / 60).toFixed(0)} minutes ago`;
  } else if (res < 60 * 60 * 24) {
    return `${(res / 60 / 60).toFixed(0)} hours ago`;
  } else if (res < 60 * 60 * 24 * 30) {
    return `${(res / 60 / 60 / 24).toFixed(0)} days ago`;
  } else if (res < 60 * 60 * 24 * 30 * 365) {
    return `${(res / 60 / 60 / 24 / 30).toFixed(0)} months ago`;
  } else return `${(res / 60 / 60 / 24 / 30 / 365).toFixed(0)} years ago`;
};
