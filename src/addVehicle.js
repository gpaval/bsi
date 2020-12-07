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
    proprietarEmail,
  } = event.body;

  const vehicle = {
    VIN: vin,
    licensePlateNumber: licensePlateNumber,
    year: year,
    make: make,
    model: model,
    color: color,
    proprietarEmail,
  };

  await driver.executeLambda(async (txn) => {
    txn.execute("INSERT INTO Vehicle ?", vehicle);
  });

  callback(null, "Inserted: " + JSON.stringify(vehicle));
};
