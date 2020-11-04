var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");
  const name = event.params.querystring.name;

  const data = await driver.executeLambda(async (txn) => {
    return txn.execute("SELECT * FROM People WHERE lastName = ?", name);
  });

  callback(null, data);
};
