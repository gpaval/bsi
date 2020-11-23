const AWS = require("aws-sdk");

module.exports.handler = async (event, context, callback) => {
  console.log(event);
  let connectionId = event.requestContext.connectionId;
  let messageReceived = event.body;

  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const callbackUrlForAWS = `https://${domain}/${stage}`; //construct the needed url

  const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: callbackUrlForAWS,
  });

  try {
    if (messageReceived) {
      messageReceived = JSON.parse(messageReceived);

      if (messageReceived.type === "connectionId") {
        await apiGatewayManagementApi
          .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({
              message: "test!",
              type: messageReceived.type,
              connectionId: connectionId,
            }),
          })
          .promise();
      } else if (messageReceived.type === "registering") {
        console.log("33: ", messageReceived);
        connectionId = messageReceived.connectionId; // TREBUIE INCERCAT SA TRIMITI LA NOUL CONNECTION ID
        await apiGatewayManagementApi
          .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({
              message: "3.14!",
              type: messageReceived.type,
              connectionId: connectionId,
            }),
          })
          .promise();
      } else {
        await apiGatewayManagementApi
          .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({
              message: "CEVA!",
              type: messageReceived.type,
              connectionId: connectionId,
            }),
          })
          .promise();
      }
    }
  } catch (err) {
    console.log(`error: ${err}`);
  }

  return { statusCode: 200, body: "Data sent." };
};
