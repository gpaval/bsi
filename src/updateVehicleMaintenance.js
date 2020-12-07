var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");

  const { vin, operation, kilometers, date, serviceName, conclusion } = event.body;

  const maintenance = {
    VIN: vin,
    operation: operation,
    kilometers: kilometers,
    date: date,
    serviceName: serviceName,
    conclusion: conclusion
  };

  await driver.executeLambda(async (txn) => {
    txn.execute("INSERT INTO VehicleMaintenance ?", maintenance);
  });

  callback(null, "Inserted: " + JSON.stringify(maintenance));
};