const express = require("express");
const app = express();
const ConnectDb = require("./ConnectDb");
const controller = require("./Controller");
const auth = require("./Middlewares/Authentication");
app.use(express.json());

app.post("/api/ideas", async (req, res) => {
  //route for saving ideas
  const response = await controller.SaveIdeaToDb(req.body);
  if (response.ok) {
    res.status(200).json({ ok: true });
  } else res.status(400).json({ ok: false, msg: response.error });
});

app.post("/api/register", async (req, res) => {
  //route for registering user
  const result = await controller.register(req.body);
  if (!result.ok) {
    res.status(400).json({
      ok: false,
      msg: result.error,
    });
  } else
    res.status(200).json({
      ok: true,
    });
});

app.post("/api/login", async (req, res) => {
  const result = await controller.login(req.body);
  if (!result.ok) {
    res.status(400).json({
      ok: false,
      msg: result.error,
    });
  } else
    res.status(200).json({
      ok: true,
      token: result.token,
    });
});

app.listen(3000, async () => {
  console.log("server started");
  await ConnectDb();
});
