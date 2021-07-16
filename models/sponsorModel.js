const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  docStatus: {
    type: String,
    enum: ["Active", "Inactive", "Deleted"],
    default: "Active",
  },
  organisationName: {
    type: String,
  },
  logo: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Diamond', 'Platinum', 'Gold', 'Bronze'],
  },
  website: {
    type: String,
  },
  initiatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);
module.exports = Sponsor;
