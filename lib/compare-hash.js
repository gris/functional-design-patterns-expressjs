const bcrypt = require("bcrypt");

let compareHash = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = compareHash;
