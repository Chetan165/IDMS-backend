const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("<body>Hello</body>");
});
app.listen(3000, () => {
  console.log("server started");
});
