let AWS = require("aws-sdk");

AWS.config.update({ region: "eu-central-1" });
module.exports = (action, params) => {
  const dynamoDb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  return dynamoDb[action](params).promise();
};
