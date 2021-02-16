const express = require("express");
const next = require("next");

const bodyParser = require("body-parser");
const morgan = require('morgan');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );
  server.use('/auth', authRoutes);
  server.use('/user', userRoutes);

  server.all("*", (req, res) => {
    return handle(req, res);
  });



  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
