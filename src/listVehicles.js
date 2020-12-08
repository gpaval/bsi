var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");
  const proprietar = event.params.querystring.uid;

  const data = await driver.executeLambda(async (txn) => {
    return txn.execute("SELECT * FROM Vehicle WHERE uid = ?", proprietar);
  });

  callback(null, data._resultList);
};
