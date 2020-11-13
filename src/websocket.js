const AWS = require("aws-sdk");

module.exports.handler = async (event, context, callback) => {
  const connectionId = event.requestContext.connectionId;

  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const callbackUrlForAWS = `https://${domain}/${stage}`; //construct the needed url

  const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: callbackUrlForAWS,
  });

  try {
    await apiGatewayManagementApi
      .postToConnection({
        ConnectionId: connectionId,
        Data: "test!",
      })
      .promise();
  } catch (err) {
    console.log(`error: ${err}`);
  }

  return { statusCode: 200, body: "Data sent." };
};
