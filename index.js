const express = require("express");
const app = express();
const ConnectDb = require("./ConnectDb");
const controller = require("./Controller");
app.use(express.json());

app.post("/api/ideas", async (req, res) => {
  //route for saving ideas
  await controller.SaveIdeaToDb(req.body);
  res.send("idea saved");
});

app.post("/api/register", async (req, res) => {
  //route for registering user
  const result = await controller.register(req.body);
  if (!result.ok) {
    res.status(400).send(result.error);
  } else res.status(200).send("user registered");
});

app.post("/api/login", async (req, res) => {
  const result = await controller.login(req.body);
  if (!result.ok) {
    res.status(400).send(result.error);
  } else res.status(200).json({ token: result.token });
});

app.listen(3000, async () => {
  console.log("server started");
  await ConnectDb();
});
