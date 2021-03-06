const AWS = require("aws-sdk");
const dynamodb = require("../libs/dynamodb-lib");
const tableName = process.env.ENTITIES_TABLE;

exports.handler = async (event, context, callback) => {
  const id = event.params.querystring.id;
  const paramsGet = {
    TableName: tableName,
    Key: {
      id: { S: id },
    },
  };
  data = await dynamodb("getItem", paramsGet);
  data = AWS.DynamoDB.Converter.unmarshall(data.Item);
  callback(null, data);
};
