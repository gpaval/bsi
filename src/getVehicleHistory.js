var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");
  const vin = event.params.querystring.vin;
  const result = {
    vehicleHistory: [],
    maintenanceHistory: [],
  };

  const vehicleHistory = [];
  let data = await driver.executeLambda(async (txn) => {
    $query = "SELECT * FROM history(Vehicle) AS v WHERE v.data.VIN = ?";
    return txn.execute($query, vin);
  });
  vehicleHistory.push(...data._resultList);

  for (let i = 1; i < vehicleHistory.length; i++) {
    const previousVehicle = vehicleHistory[i - 1].data;
    const currentVehicle = vehicleHistory[i].data;
    const obj = {
      date: new Date(vehicleHistory[i].metadata.txTime),
      changes: [],
    };

    if (currentVehicle.color + "" != previousVehicle.color + "") {
      obj.changes.push(
        `Changed colour: ${previousVehicle.color} -> ${currentVehicle.color}`
      );
    }

    if (currentVehicle.uid + "" != previousVehicle.uid + "") {
      obj.changes.push(
        `Changed owner: ${previousVehicle.uid} -> ${currentVehicle.uid}`
      );
    }

    if (
      currentVehicle.licensePlateNumber + "" !=
      previousVehicle.licensePlateNumber + ""
    ) {
      obj.changes.push(
        `Changed license plate number: ${previousVehicle.licensePlateNumber} -> ${currentVehicle.licensePlateNumber}`
      );
    }

    result.vehicleHistory.push(obj);
  }

  const maintenanceHistory = [];
  data = await driver.executeLambda(async (txn) => {
    $query =
      "SELECT * FROM history(VehicleMaintenance) AS vm WHERE vm.data.VIN = ?";
    return txn.execute($query, vin);
  });
  maintenanceHistory.push(...data._resultList);

  for (let i = 0; i < maintenanceHistory.length; i++) {
    if (maintenanceHistory[i].data.data) {
      maintenanceHistory[i].data.date = maintenanceHistory[i].data.data;
      delete maintenanceHistory[i].data.data;
    }

    result.maintenanceHistory.push(maintenanceHistory[i].data);
  }

  console.log(JSON.stringify(result));
  callback(null, result);
};
