const Validator = require(".");

Validator("transaction.xml")
	.then((isValid) => {
		console.log(`is valid: ${isValid ? "yes" : "no"}`);
	})
	.catch((error) => {
		console.log(`ERROR: ${error.message}`);
	});
