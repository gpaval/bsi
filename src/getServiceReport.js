var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");
  const service = event.params.querystring.service;
  const result = [];
  const maintenanceHistory = [];
  data = await driver.executeLambda(async (txn) => {
    $query =
      "SELECT * FROM history(VehicleMaintenance) AS vm WHERE vm.data.serviceName = ?";
    return txn.execute($query, service);
  });
  maintenanceHistory.push(...data._resultList);

  for (let i = 0; i < maintenanceHistory.length; i++) {
    if (maintenanceHistory[i].data.data) {
      maintenanceHistory[i].data.date = maintenanceHistory[i].data.data;
      delete maintenanceHistory[i].data.data;
    }

    result.push(maintenanceHistory[i].data);
  }

  console.log(JSON.stringify(result));
  callback(null, result);
};
