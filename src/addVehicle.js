var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");

  const {
    vin,
    licensePlateNumber,
    year,
    make,
    model,
    color,
    uid,
    kilometers
  } = event.body;

  const vehicle = {
    VIN: vin,
    year: year,
    make: make,
    model: model,
    color: color,
  };
  if (uid) {
    vehicle.uid = uid;
  }
  if (licensePlateNumber) {
    vehicle.licensePlateNumber = licensePlateNumber;
  }

  const maintenance = {
    VIN: vin,
    operation: 'inregistrare RAR',
    kilometers: kilometers,
    date: Date.now(),
    serviceName: 'RAR',
    details: 'Inregistrare Registrul Auto Roman',
    icon: 'creationIcon',
  };
  await driver.executeLambda(async (txn) => {
    txn.execute("INSERT INTO Vehicle ?", vehicle);
    // add a maintenance record automatically after the car is inserted
    await txn.execute("INSERT INTO VehicleMaintenance ?", maintenance);
  });

  callback(null, "Inserted: " + JSON.stringify(vehicle));
};
