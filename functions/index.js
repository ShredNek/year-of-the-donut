const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const functions = require("firebase-functions");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.set("strictQuery", true);

const doughnutSegmentDataSchema = mongoose.Schema({
  segmentState: String,
  description: String,
  childNumber: Number,
});

console.log(process.env.MONGO_DB_URI);

const SegmentData = mongoose.model("SegmentData", doughnutSegmentDataSchema);

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(console.log("we in de mongodb"));

app.get("/segments", (req, res) => {
  SegmentData.find().then((items) => {
    res.send(items);
  });
});

app.post("/segments", (req, res) => {
  SegmentData.create({
    segmentState: req.body.segmentState,
    description: req.body.description,
    childNumber: req.body.childNumber,
  })
    .then((doc) => console.log(doc))
    .catch((err) => console.error(err));
});

app.put("/edit/:childNumber", (req, res) => {
  SegmentData.findOneAndUpdate(
    { childNumber: req.params.childNumber },
    {
      $set: req.body,
      new: true,
    },
    { new: true, upsert: false }
  )
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

app.delete("/delete/:childNumber", (req, res) => {
  console.log(req.params.childNumber);
  SegmentData.findOneAndDelete({ childNumber: req.params.childNumber })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

// app.listen(process.env.VITE_PORT, () =>
//   console.log(`Listening on ${process.env.VITE_PORT}`)
// );

exports.server = functions.region("australia-southeast1").https.onRequest(app);
