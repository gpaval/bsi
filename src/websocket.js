const AWS = require("aws-sdk");
const dynamodb = require("../libs/dynamodb-lib");
const citizensTable = process.env.CITIZENS_TABLE;
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
        const paramsQuery = {
          TableName: citizensTable,
          KeyConditionExpression: "email = :e",
          IndexName: "Index-Email",
          ExpressionAttributeValues: {
            ":e": { S: messageReceived.email },
          },
        };
        data = await dynamodb("query", paramsQuery);
        if (!data.Items.length) {
          await apiGatewayManagementApi
            .postToConnection({
              ConnectionId: connectionId,
              Data: JSON.stringify({
                message: "NO DATE!",
                type: messageReceived.type,
                connectionId: connectionId,
              }),
            })
            .promise();
        } else {
          user = AWS.DynamoDB.Converter.unmarshall(data.Items[0]);

          const obj = {};
          for (let i = 0; i < messageReceived.requiredKeys.length; i++) {
            obj[messageReceived.requiredKeys[i]] =
              user[messageReceived.requiredKeys[i]] === "userId"
                ? user.id
                : user[messageReceived.requiredKeys[i]];
          }

          connectionId = messageReceived.connectionId;
          await apiGatewayManagementApi
            .postToConnection({
              ConnectionId: connectionId,
              Data: JSON.stringify({
                message: JSON.stringify(obj),
                type: messageReceived.type,
                connectionId: connectionId,
              }),
            })
            .promise();
        }
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
