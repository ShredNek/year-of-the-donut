import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// mongoose.set("debug", true);
mongoose.set("strictQuery", true);

const doughnutSegmentDataSchema = mongoose.Schema({
  segmentState: String,
  description: String,
  childNumber: Number,
});

const SegmentData = mongoose.model("SegmentData", doughnutSegmentDataSchema);

async function run() {
  try {
    await mongoose
      .connect(process.env.MONGO_DB_URI)
      .then(console.log("we in de mongodb"));

    app.get("/segments", (req, res) => {
      console.log("Getting data");
      SegmentData.find().then((items) => {
        res.json(items);
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

    app.put("/edit/:childNumber", (req, res) => {
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

    app.delete("/delete/:childNumber", (req, res) => {
      console.log("Deleting");
      console.log(req.params.childNumber);
      SegmentData.findOneAndDelete({ childNumber: req.params.childNumber })
        .then((doc) => console.log(doc))
        .catch((err) => console.log(err));
    });

    app.listen(process.env.PORT || 3001, () => {
      console.log(`express is on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log("MONGODB Error:" + err);
  }
}

run();
