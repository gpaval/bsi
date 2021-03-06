const AWS = require("aws-sdk");
const dynamodb = require("../libs/dynamodb-lib");
const tableName = process.env.ENTITIES_TABLE;
const { v4: uuidv4 } = require("uuid");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
  const { id, name, managerEmail, requiredKeys } = event.body;
  const params = {
    TableName: tableName,
    Item: {
      id: id,
      name: name,
      managerEmail: managerEmail,
      requiredKeys: [...requiredKeys],
    },
  };

  docClient.put(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to edit item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("edited item:", JSON.stringify(data, null, 2));
    }
  });

  callback(null, "edited: " + JSON.stringify(params));
};
