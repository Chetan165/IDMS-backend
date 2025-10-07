const express = require("express");
const app = express();
const ConnectDb = require("./ConnectDb");

app.get("/", (req, res) => {
  res.send("<body>Hello</body>");
});
app.listen(3000, async () => {
  console.log("server started");
  await ConnectDb();
});
