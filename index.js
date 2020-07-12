require("dotenv").config();
const express = require("express");

const usersRouter = require("./routes/users");
const { emailsRouter, getEmailMimeType } = require("./routes/emails");

const NotFound = require("./lib/not-found");
const morgan = require("morgan");
const compress = require("compression");
const serveStatic = require("serve-static");
const path = require("path");
const basicAuth = require("./lib/basic-auth");
const tokenAuth = require("./lib/token-auth");
const requireAuth = require("./lib/require-auth");
const findUser = require("./lib/find-user");
const tokensRouter = require("./routes/tokens");
const enforce = require("./lib/enforce");
const emails = require("./fixtures/emails");

let logger = morgan("tiny");

let app = express();

let notFoundHandler = (err, req, res, next) => {
  if (err instanceof NotFound) {
    res.status(404);
    res.send("Not Found resource");
    next();
  } else {
    next(err);
  }
};

let setContentType = (res, path) => {
  const relativePath = path.split("/pony-express")[1];
  console.log(relativePath);
  const type = getEmailMimeType(relativePath);
  if (type !== "") {
    res.setHeader("Content-Type", type);
  }
};

let emailAttachmentPolicy = (user, attachmentId) => {
  return emails.find((email) => {
    return (
      (user.id === email.from || user.id === email.to) &&
      (email.attachments || []).find(
        (attachment) =>
          attachment.fileName.split("/uploads/")[1] === attachmentId
      )
    );
  });
};

app.use(logger);
app.use(compress());
app.use(serveStatic(path.join(__dirname, "./public")));
app.use(basicAuth(findUser.byCredentials));
app.use(
  "/uploads",
  requireAuth,
  enforce(emailAttachmentPolicy),
  (req, res, next) => {
    req.authorize(req.path.split("/")[1]);
    next();
  },
  serveStatic(path.join(__dirname, "uploads"), { setHeaders: setContentType })
);
app.use("/tokens", tokensRouter);
app.use(tokenAuth(findUser.byToken));
app.use("/users", usersRouter);
app.use("/emails", emailsRouter);
app.use(notFoundHandler);

app.listen(3000);
