const path = require("path");
const express = require("express");
const emails = require("../fixtures/emails");
const respond = require("../lib/respond");
const generateId = require("../lib/generate-id");
const bodyParser = require("body-parser");
const NotFound = require("../lib/not-found");
const multer = require("multer");
const requireAuth = require("../lib/require-auth");
const enforce = require("../lib/enforce");

let upload = multer({ dest: path.join(__dirname, "../uploads") });

let getEmailsRoute = (req, res) => {
  respond(req, res, emails);
};

let getEmailRoute = (req, res) => {
  let email = emails.find((email) => email.id === req.params.id);
  req.authorize(email);
  if (!email) {
    throw new NotFound();
  }
  respond(req, res, email);
};

let getEmailPolicy = (user, email) =>
  user.id === email.from || user.id === email.to;

let createEmailRoute = (req, res) => {
  let attachments = (req.files || []).map((file) => {
    return { fileName: "/uploads/" + file.filename, mimeType: file.mimetype };
  });
  let newEmail = { ...req.body, id: generateId(), attachments };
  req.authorize(newEmail);
  emails.push(newEmail);
  res.status(201);
  res.send(newEmail);
};

let createEmailPolicy = (user, email) => user.id === email.from;

let updateEmailRoute = (req, res) => {
  let email = emails.find((email) => email.id === req.params.id);
  req.authorize(email);
  let newAttachments = (req.files || []).map((file) => {
    return { fileName: "/uploads/" + file.filename, mimeType: file.mimetype };
  });
  req.body.attachments = email.attachments
    ? email.attachments.concat(newAttachments)
    : newAttachments;
  if (!email) {
    throw new NotFound();
  }
  Object.assign(email, req.body);
  res.status(200);
  res.send(email);
};

let updateEmailPolicy = (user, email) => user.id === email.from;

let deleteEmailPolicy = (user, email) => user.id === email.to;

let deleteEmailRoute = (req, res) => {
  let email = emails.find((email) => email.id === req.params.id);
  req.authorize(email);
  let index = emails.findIndex((email) => email.id === req.params.id);
  if (index === -1) {
    throw new NotFound();
  }
  emails.splice(index, 1);
  res.sendStatus(204);
};

let getEmailMimeType = (path) => {
  const email = emails.find((email) =>
    (email.attachments || []).find((file) => file.fileName === path)
  );
  const attachment = (email || { attachments: [] }).attachments.find(
    (attachment) => attachment.fileName === path
  );

  if (!attachment) {
    return "";
  }
  return attachment.mimeType;
};

let emailsRouter = express.Router();

emailsRouter.use(requireAuth);

emailsRouter
  .route("/")
  .get(getEmailsRoute)
  .post(
    enforce(createEmailPolicy),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    upload.array("attachments"),
    createEmailRoute
  );

emailsRouter
  .route("/:id")
  .get(enforce(getEmailPolicy), getEmailRoute)
  .patch(
    enforce(updateEmailPolicy),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    upload.array("attachments"),
    updateEmailRoute
  )
  .delete(enforce(deleteEmailPolicy), deleteEmailRoute);

module.exports = {
  emailsRouter,
  getEmailMimeType,
};
