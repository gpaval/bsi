const AWS = require("aws-sdk");

module.exports.handler = async (event, context, callback) => {
  const routeKey = event.requestContext.routeKey;
  const connectionId = event.requestContext.connectionId;

  console.log(routeKey, connectionId);

  console.log("event", JSON.stringify(event));
  console.log("context", JSON.stringify(context));

  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const callbackUrlForAWS = `https://${domain}/${stage}`; //construct the needed url
  // await sendMessageToClient(callbackUrlForAWS, connectionId, event);

  // body = JSON.parse(event.body);
  // console.log(body);

  setInterval(async () => {
    console.log("SENDING");
    event.body = { text: `Test` };
    await sendMessageToClient(callbackUrlForAWS, connectionId, event);
    console.log("SENT");
  }, 3000);

  // switch (routeKey) {
  //   case "$connect":
  //     event.body = { text: `Test` };
  //     await sendMessageToClient(callbackUrlForAWS, connectionId, event);
  //     // return callback(null, {
  //     //   statusCode: 200,
  //     //   body: `Test`,
  //     // });
  //     break;
  //   case "$disconnect":
  //     break;
  //   case "ceva":
  //     console.log("ceva");
  //     break;

  //   default:
  //     event.body = { text: `SALUT` };
  //     await sendMessageToClient(callbackUrlForAWS, connectionId, event);
  //   // return {
  //   //   statusCode: 500,
  //   //   body: `Invalid message`,
  //   // };
  // }

  return {
    statusCode: 200,
  };
};

const sendMessageToClient = (url, connectionId, payload) => {
  new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: url,
    });
    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId, // connectionId of the receiving ws-client
        Data: JSON.stringify(payload),
      },
      (err, data) => {
        if (err) {
          console.log("err is", err);
          reject(err);
        }
        resolve(data);
      }
    );
  });
};
