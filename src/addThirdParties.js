const AWS = require("aws-sdk");
const dynamodb = require("../libs/dynamodb-lib");
const tableName = process.env.ENTITIES_TABLE;
const { v4: uuidv4 } = require('uuid');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {

	const { firstName, lastName, email, permisson, name } = event.body;
	const id = uuidv4();
	const params = {
		TableName:tableName,
		Item:{
			"id": id,
			"name": name,
			"permisson": permisson,
			"requiredKeys": {
				'email': email,
				'firstName' : firstName,
				'lastName' : lastName
			}
		}
	};

	docClient.put(params, function(err, data) {
		if (err) {
			console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("Added item:", JSON.stringify(data, null, 2));
		}
	});

  callback(null, "inserted: " + JSON.stringify(params));
};