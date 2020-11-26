const AWS = require("aws-sdk");
const qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");
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
        let sql = "SELECT ";
        for (let i = 0; i < messageReceived.requiredKeys.length; i++) {
          sql += messageReceived.requiredKeys[i] + ", ";
        }
        const pos = sql.lastIndexOf(",");
        sql = sql.substring(0, pos) + sql.substring(pos + 1);
        sql += " FROM People WHERE email = ?";

        const data = await driver.executeLambda(async (txn) => {
          return txn.execute(sql, messageReceived.email);
        });

        connectionId = messageReceived.connectionId;
        await apiGatewayManagementApi
          .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({
              message: JSON.stringify(data.getResultList()),
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
