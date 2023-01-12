const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const functions = require("firebase-functions");

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

const SegmentData = mongoose.model("SegmentData", doughnutSegmentDataSchema);

mongoose
  .connect(
    "mongodb+srv://new-user_1:user1@cluster0.mklub.mongodb.net/time-count"
  )
  .then(console.log("we in de mongodb"));

app.get("/segments", (req, res) => {
  console.log("Getting data");
  SegmentData.find().then((items) => {
    res.send(res.json(items));
  });
});

app.post("/segments", (req, res) => {
  console.log("Posting");
  SegmentData.create({
    segmentState: req.body.segmentState,
    description: req.body.description,
    childNumber: req.body.childNumber,
  })
    .then((doc) => console.log(doc))
    .catch((err) => console.error(err));
});

app.put("/segments/edit/:childNumber", (req, res) => {
  console.log("Editing");
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

app.delete("/segments/delete/:childNumber", (req, res) => {
  console.log("Deleting");
  console.log(req.params.childNumber);
  SegmentData.findOneAndDelete({ childNumber: req.params.childNumber })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

exports.server = functions.region("australia-southeast1").https.onRequest(app);
