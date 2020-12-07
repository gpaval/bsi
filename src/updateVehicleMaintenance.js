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

    // Check if doc with GovId = govId exists
    const results: ionJs.dom.Value[] = (await txn.execute('SELECT * FROM VehicleMaintenance WHERE VIN= ?', vin)).getResultList();
    // Check if there are any results
    if (results.length) {
      // Document already exists, we need to update
      await txn.execute('UPDATE VehicleMaintenance AS p SET p = ? WHERE p.VIN = ?', maintenance, vin);
    } else {
      await txn.execute("INSERT INTO VehicleMaintenance ?", maintenance);
    }

  });

  callback(null, "Inserted: " + JSON.stringify(maintenance));
};