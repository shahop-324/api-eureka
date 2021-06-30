const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  socialMediaHandles: {
    type: Map,
    of: String,
  },
  logo: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Platinum', 'Gold', 'Silver', 'Bronze'],
  },
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);
module.exports = Sponsor;
