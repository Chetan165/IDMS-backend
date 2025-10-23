const express = require("express");
const app = express();
const ConnectDb = require("./ConnectDb");
const controller = require("./Controller");
const auth = require("./Middlewares/Authentication");
const cors = require("cors");
const upload = require("./Middlewares/upload");
const fs = require("fs");
const uploadToS3 = require("./handleuploads");
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
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
  //login route
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

app.get("/api/protected", auth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.get("/api/getideas", auth, async (req, res) => {
  const result = await controller.getIdeas(req.user);
  if (!result.ok) {
    res.status(400).json({ ok: false, msg: result });
  } else res.status(200).json({ ok: true, ideas: result, user: req.user });
});

app.get("/api/admin/stats", auth, async (req, res) => {
  const data = await controller.AdminDashboardStats(req.user);
  console.log(data);
  if (!data.ok) {
    res.json({ ok: false, msg: data.error });
  } else {
    res.status(200).json({ ok: true, data });
  }
});

app.get("/api/getideasAll", async (req, res) => {
  const data = await controller.getIdeasAll();
  console.log(data);
  if (!data.ok) {
    res.status(400).json({ ok: false, msg: data.error });
  } else res.status(200).json({ ok: true, ideas: data.ideas });
});

app.post("/upload", upload.default.single("file"), async (req, res) => {
  console.log(req.file);
  console.log(req.body.fileid);

  if (!req.file) {
    res.json({ ok: false, msg: "File not found" });
    return;
  }
  // fs.writeFile(
  //   `./uploads/${req.body.fileid + req.file.originalname}`,
  //   req.file.buffer,
  //   (err) => {
  //     if (err) {
  //       return res.json({ ok: false, msg: "File upload failed" });
  //     }
  //   }
  // );
  const respone = await uploadToS3(
    req.file.buffer,
    req.file.mimetype,
    req.body.fileid + req.file.originalname
  );
  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${
    process.env.AWS_REGION
  }.amazonaws.com/${req.body.fileid}${req.file.originalname.replace(" ", "+")}`;
  const UrlUpdated = await controller.UpdateUrl(req.body.fileid, url);
  res.json({ ok: true, msg: "file uploaded successfully" });
});

app.listen(3000, async () => {
  console.log("server started");
  await ConnectDb();
});
