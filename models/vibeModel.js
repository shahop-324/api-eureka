const mongoose = require("mongoose");
const vibeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    key: {
      type: String,
    },
    eventId: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

vibeSchema.index({
  name: "text",
});

const Vibe = mongoose.model("Vibe", vibeSchema);
module.exports = Vibe;
