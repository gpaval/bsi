const AWS = require("aws-sdk");
const dynamodb = require("../libs/dynamodb-lib");
const tableName = process.env.ENTITIES_TABLE;

exports.handler = async (event, context, callback) => {
  const params = {
    TableName: tableName,
  };

  let data = "";
  const entities = [];
  const requiredKeys = [];
  try {
    do {
      if (data.LastEvaluatedKey) {
        params["ExclusiveStartKey"] = data.LastEvaluatedKey;
      }

      data = await dynamodb("scan", params);
      entities.push(...data.Items);
    } while (data.LastEvaluatedKey);

    for (let i = 0, dLen = entities.length; i < dLen; i++) {
      let entity = AWS.DynamoDB.Converter.unmarshall(entities[i]);
      for (let j = 0; j < entity.requiredKeys.length; j++) {
        if (!requiredKeys.includes(entity.requiredKeys[j])) {
          requiredKeys.push(entity.requiredKeys[j]);
        }
      }
    }
    callback(null, requiredKeys);
  } catch (err) {
    console.log(err);
  }
};
