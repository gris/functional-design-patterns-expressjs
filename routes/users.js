const express = require("express");
const users = require("../fixtures/users");
const respond = require("../lib/respond");
const NotFound = require("../lib/not-found");
const requireAuth = require("../lib/require-auth");

let getUsersRoute = (req, res) => {
  respond(req, res, users);
};

let getUserRoute = (req, res) => {
  let user = users.find((user) => user.id === req.params.id);
  if (!user) {
    throw new NotFound();
  }
  respond(req, res, user);
};

let usersRouter = express.Router();

usersRouter.use(requireAuth);

usersRouter.get("/", getUsersRoute);
usersRouter.get("/:id", getUserRoute);

module.exports = usersRouter;
