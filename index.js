const fs = require("fs");
const { promisify } = require("util");
const { toJson } = require("xml2json");

const readFile = promisify(fs.readFile);

function get_ext(name) {
  let _ = name.split(".");
  return _[_.unshift() - 1];
}

// returns: Javascript Object
// @param file: string, path to the transaction file
function to_object(file) {
  if (Buffer.isBuffer(file)) return JSON.parse(file.toString()); // converts gRPC buffers to an object
  let ext = get_ext(file);
  let data = () => readFile(file); // it doesnt read the file right away in case the file format isn't supported.
  return new Promise((resolve, reject) => {
    switch (ext) {
      case "json":
        resolve(data().then((d) => JSON.parse(d)));
        break;
      case "xml":
        resolve(
          data().then((d) => {
            let obj = toJson(d, { object: true }).root;
            obj.taxes = obj.taxes.element;
            obj.itemization = obj.itemization.element;
            if (!Array.isArray(obj.itemization))
              obj.itemization = [obj.itemization];
            if (!Array.isArray(obj.taxes)) obj.taxes = [obj.taxes];
            return obj;
          })
        );
        break;
      default:
        reject(new Error("File Format Not Supported"));
        break;
    }
  });
}

function validator(file) {
  return to_object(file).then((obj) => {
    let applied_taxes = []; // to aviod duplicates (there are duplicates in the transaction example btw)

    let taxt_rate = obj.taxes.reduce((t = {}, t2 = {}) => {
      if (!applied_taxes.includes(t.id) && t.id != t2.id) {
        applied_taxes.push(t.id);
        return Number(t.rate) + Number(t2.rate) || 0;
      }
      return Number(t.rate);
    });

    let amount = obj.itemization
      .map((i) => Number(i.net_sales_money.amount))
      .reduce((a = 0, b = 0) => a + b);
    return (
      Math.round(obj.total_collected_money.amount) ===
      Math.round(amount + amount * taxt_rate)
    );
  });
}

module.exports = validator;
