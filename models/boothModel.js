const mongoose = require('mongoose');

const boothSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Active", "Inactive", "Deleted"],
    default: "Active",
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
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
  tags: [{ type: String }],
});

const Booth = mongoose.model('Booth', boothSchema);
module.exports = Booth;
