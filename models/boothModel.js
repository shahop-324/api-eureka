const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Deleted"],
    default: "Active",
  },
  name: {
    type: String,
  },
  emails: [
    {
      type: String,
    },
  ],
  tags: [{ type: String }],
  tagline: {
    type: String,
  },
  description: {
    type: String,
  },
  boothLogo: {
    type: String,
  },
  boothPoster: {
    type: String,
  },
  socialMediaHandles: {
    type: Map,
    of: String,
  },
});

boothSchema.index({
  name: "text",
  description: "text",
  tagline: "text",
  tags: "text",
  emails: "text",
});

boothSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: "Deleted" } });
  next();
});

const Booth = mongoose.model("Booth", boothSchema);
module.exports = Booth;
