var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");
  const vin = event.params.querystring.vin;

  const data = await driver.executeLambda(async (txn) => {
    return txn.execute("SELECT * FROM Vehicle AS v, VehicleMaintenance AS vm WHERE vm.VIN = v.VIN AND v.VIN = '?'", vin);
  });
  console.log(data);
  callback(null, data);
};