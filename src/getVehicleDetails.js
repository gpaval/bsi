var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");
  const vin = event.params.querystring.vin;
  const result = [];

  let data = await driver.executeLambda(async (txn) => {
    return txn.execute("SELECT v.* FROM Vehicle AS v WHERE v.VIN = ?", vin);
  });
  result.push(...data._resultList);

  data = await driver.executeLambda(async (txn) => {
    return txn.execute(
      "SELECT vm.kilometers FROM VehicleMaintenance AS vm WHERE vm.VIN = ?",
      vin
    );
  });
  result.push(...data._resultList);

  console.log(result);
  callback(null, result);
};
