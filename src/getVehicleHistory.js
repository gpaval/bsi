var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");
  const vin = event.params.querystring.vin;
  const result = [];

  let data = await driver.executeLambda(async (txn) => {
    $query = "SELECT * FROM history(Vehicle) AS v WHERE v.data.VIN = ?";
    return txn.execute($query, vin);
  });
  result.push(...data._resultList);

  data = await driver.executeLambda(async (txn) => {
    $query =
      "SELECT * FROM history(VehicleMaintenance) AS vm WHERE vm.data.VIN = ?";
    return txn.execute($query, vin);
  });
  result.push(...data._resultList);

  console.log(result);
  callback(null, result);
};
