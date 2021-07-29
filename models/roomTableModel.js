const mongoose = require("mongoose");
const roomTableSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
    tableId: {
      type: String,
    },
    tableImage: {
      type: String,
    },
    tableText: {
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
