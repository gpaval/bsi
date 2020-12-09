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
    objMaintenance = maintenanceHistory[i].data;
    if (objMaintenance.data) {
      objMaintenance.date = objMaintenance.data;
      delete objMaintenance.data;
    }

    const obj = {
      date: objMaintenance.date,
      changes: "VIN: " + objMaintenance.VIN,
    };

    if (objMaintenance.operation) {
      obj.changes += " | operation: " + objMaintenance.operation;
    }
    if (objMaintenance.kilometers) {
      obj.changes += " | kilometers: " + objMaintenance.kilometers;
    }
    if (objMaintenance.details) {
      obj.changes += " | details: " + objMaintenance.details;
    }

    result.push(obj);
  }

  console.log(JSON.stringify(result));
  callback(null, result);
};
