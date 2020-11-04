var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");

  const { firstName, lastName, age, phoneNumber } = event.body;

  const person = {
    firstName: firstName,
    lastName: lastName,
    age: age,
    phoneNumber: phoneNumber,
  };

  await driver.executeLambda(async (txn) => {
    txn.execute("INSERT INTO People ?", person);
  });

  callback(null, "Inserted: " + JSON.stringify(person));
};
