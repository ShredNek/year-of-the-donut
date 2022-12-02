import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.set("debug", true);

export const MONGO_DB_URI =
  "mongodb+srv://new-user_1:user1@cluster0.mklub.mongodb.net/time-count";

const doughnutSegmentDataSchema = mongoose.Schema({
  segmentState: String,
  description: String,
  childNumber: Number,
});

const SegmentData = mongoose.model("SegmentData", doughnutSegmentDataSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_DB_URI).then(console.log("we in de mongodb"));
  } catch (err) {
    console.log(err);
  }
}

run();

app.get("/", (req, res) => {
  SegmentData.find().then((items) => {
    res.json(items);
  });
});

app.post("/", (req, res) => {
  SegmentData.create({
    segmentState: req.body.segmentState,
    description: req.body.description,
    childNumber: req.body.childNumber,
  })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

app.put("/edit/:childNumber", (req, res) => {
  console.log("EDIT");
  SegmentData.findOneAndUpdate(
    { childNumber: req.params.childNumber },
    {
      $set: req.body,
      new: true,
    },
    { new: true, upsert: false, remove: {}, fields: {} }
  )
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

app.delete("/delete/:childNumber", (req, res) => {
  console.log("DELETE");
  console.log(req.params.childNumber);
  SegmentData.findOneAndDelete({ childNumber: req.params.childNumber })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

app.listen(3001, function () {
  console.log("express is on 3001");
});
