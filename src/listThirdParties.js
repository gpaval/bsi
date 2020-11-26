const AWS = require("aws-sdk");
const dynamodb = require("../libs/dynamodb-lib");
const tableName = "third_parties";

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
  let params = { TableName: tableName };
  let scanResults = [];
  let items;

  do {
      items = await docClient.scan(params).promise();
      items.Items.forEach((item) => scanResults.push(item));
      params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != "undefined");

  callback(null, scanResults);
};