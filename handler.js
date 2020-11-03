var qldb = require("amazon-qldb-driver-nodejs");

module.exports.hello = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");

  // await driver.executeLambda(async (txn) => {
  //   txn.execute("CREATE TABLE People");
  // });

  const person = {
    firstName: "John",
    lastName: "Doe",
    age: 42,
    phoneNumber: "etc.",
  };

  await driver.executeLambda(async (txn) => {
    txn.execute("INSERT INTO People ?", person);
  });

  const data = await driver.executeLambda(async (txn) => {
    return txn.execute(
      "SELECT firstName, age, lastName FROM People  WHERE firstName = ?",
      "John"
    );
  });

  console.log("SUCCES", JSON.stringify(data));
  // callback(null, crypt(data));
};
