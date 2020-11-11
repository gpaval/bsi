module.exports.handler = async (event, context, callback) => {
  const routeKey = event.requestContext.routeKey;

  console.log(routeKey);

  console.log("event", event);
  console.log("context", context);

  switch (routeKey) {
    case "$connect":
      break;
    case "$disconnect":
      break;

    // case "$ceva":
    //     console.log("ceva");
    //   break;

    default:
      return {
        statusCode: 500,
        body: `Invalid message`,
      };
  }
};
