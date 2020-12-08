var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");
  const vin = event.params.querystring.vin;

  const data = await driver.executeLambda(async (txn) => {
    $query = "SELECT * FROM history(Vehicle) AS v, history(VehicleMaintenance) AS vm WHERE vm.data.VIN = v.data.VIN AND v.data.VIN = ?";
    return txn.execute($query, vin);
  });

  console.log(data);
  callback(null, data._resultList);
};
