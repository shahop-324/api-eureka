const mongoose = require("mongoose");
const roomTableSchema = new mongoose.Schema(
  {
    priority: {
      type: String,
      enum: ["Logo", "Title"],
      default: "Logo",
    },
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
    tableId: {
      type: String,
    },
    image: {
      type: String,
    },
    title: {
      type: String,
    },
    numberOfPeople: {
      type: Number,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const RoomTable = mongoose.model("RoomTable", roomTableSchema);
module.exports = RoomTable;
