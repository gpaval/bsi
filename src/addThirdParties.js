const AWS = require("aws-sdk");
const dynamodb = require("../libs/dynamodb-lib");
const tableName = "third_parties";

const docClient = new AWS.DynamoDB.DocumentClient();




exports.handler = async (event, context, callback) => {

	const { name, permisson } = event.body;
	let tid = '3a32f9b9-07ef-4e48-8967-bfca1af6997d';
	let token = 'kjsdf872ksh198-akh2387ih-kh872haskh';
	let requiredKeys = {0 : 'email', 1 : 'name'};

	const params = {
		TableName:tableName,
		Item:{
			"name": name,
			"permisson": permisson,
			"requiredKeys": requiredKeys,
			"tid": tid,
			"token": token
		}
	};

	console.log("Adding a new item...");
	docClient.put(params, function(err, data) {
		if (err) {
			console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("Added item:", JSON.stringify(data, null, 2));
		}
	});

  callback(null, "Inserted: " + JSON.stringify(params));
};