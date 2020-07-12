const users = require("../fixtures/users");
const compareHash = require("./compare-hash");

let findUserByCredentials = ({ username, password }) => {
  return users.find((user) => {
    return user.username === username && compareHash(user.password, password);
  });
};

exports.byCredentials = findUserByCredentials;

let findUserByToken = ({ userId }) => users.find((user) => user.id === userId);

exports.byToken = findUserByToken;
