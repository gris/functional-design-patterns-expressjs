const stringify = require("csv-stringify/lib/sync");
const { create } = require("xmlbuilder2");

const respond = (req, res, data) => {
  res.format({
    "application/json": () => {
      res.send(data);
    },
    "text/csv": () => {
      if (!Array.isArray(data)) {
        data = [data];
      }
      res.send(stringify(data));
    },
    "application/xml": (req, res) => {
      if (!Array.isArray(data)) {
        data = [data];
      }
      const xmlObject = { root: {} };
      const xmlArray = data.map((element) => {
        return { "@": element };
      });
      xmlObject["root"]["data"] = xmlArray;
      const doc = create().ele(xmlObject);
      res.send(doc.end());
    },
  });
};

module.exports = respond;
