var qldb = require("amazon-qldb-driver-nodejs");

module.exports.handler = async (event, context, callback) => {
  const driver = new qldb.QldbDriver("qldb-ledger-dev");

  const { vin, operation, kilometers, serviceName, details, icon } = event.body;

  const maintenance = {
    VIN: vin,
    operation: operation,
    kilometers: kilometers,
    date: Date.now(),
    serviceName: serviceName,
    details: details,
    icon: icon,
  };

  await driver.executeLambda(async (txn) => {
    const results = (
      await txn.execute("SELECT * FROM VehicleMaintenance WHERE VIN= ?", vin)
    ).getResultList();
    // Check if there are any results
    if (results.length) {
      console.log(
        results[0],
        results[0].kilometers,
        kilometers,
        parseInt(results[0].kilometers) > parseInt(kilometers)
      );
      if (parseInt(results[0].kilometers) > parseInt(kilometers)) {
        return callback(new Error("Wrong kilometers"));
      }

      // Document already exists, we need to update
      await txn.execute(
        "UPDATE VehicleMaintenance AS p SET p = ? WHERE p.VIN = ?",
        maintenance,
        vin
      );
    } else {
      await txn.execute("INSERT INTO VehicleMaintenance ?", maintenance);
    }
  });

  callback(null, "Insert/Update: " + JSON.stringify(maintenance));
};
