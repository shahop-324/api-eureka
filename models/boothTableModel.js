const mongoose = require("mongoose");
const boothTableSchema = new mongoose.Schema(
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
    boothId: {
      type: mongoose.Schema.ObjectId,
      ref: "Booth",
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

const BoothTable = mongoose.model("BoothTable", boothTableSchema);
module.exports = BoothTable;
