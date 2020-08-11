# POSRocket Validator

A small library for validating transactions.

# Getting Started

make sure you have node.js installed on your machine

```
$ node -v
```

clone this repo

```bash
$ git clone https://github.com/mohammedgqudah/POSRocketValidator.git
$ cd POSRocketValidator
```

install the dependencies using npm/yarn

```bash
$ npm install
```

# Usage

make a new file or simply use `example.js`

```js
const POSRocketValidator = require(".");

POSRocketValidator("test_file.json")
  .then((isValid) => {
    console.log(`is valid: ${isValid ? "yes" : "no"}`);
  })
  .catch((error) => {
    console.log(`ERROR: ${error.message}`);
  });
```

Run it.

```bash
$ node example.js
```
