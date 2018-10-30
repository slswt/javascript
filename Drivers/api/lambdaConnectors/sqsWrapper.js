export default (fn) => async (event) => {
  try {
    await Promise.all(
      event.Records.map(async ({ body }) => {
        const props = JSON.parse(body);
        return fn(props);
      })
    );
  } catch (err) {
    console.log(err);
  }
};
