export default (fn) => async (args) => {
  if (!Array.isArray(args)) {
    console.log(args);
    throw new Error('Input args not Array, aborting');
  }
  console.log(args);
  await fn(...args);
  return null;
};
