export const require = (value) => {
  if (value) {
    return Promise.resolve();
  }
  return Promise.reject("");
};
