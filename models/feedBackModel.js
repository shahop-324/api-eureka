const mongoose = require('mongoose');
// here i have created schema in which i have two fields actually one is title and other is body

const feedBackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A feedback must have a concise and descriptive title.'],
    trim: true,
    minLength: 10,
    maxLength: 50,
  },
  bodyOfFeedback: {
    type: String,
    required: [true, 'A feedback must have some body for explanation purpose.'],
    trim: true,
    minLength: 20,
    maxLength: 500,
  },
  // creating more fields createdAt,createdBy and actually createdAt has type date,and createdBy {actually waht i need to do here referencing or embedding one community can create many feedBacks and one feedback can beloing to one community only now question arises if one to many is there then i do referencing or embedding actually this think can be decided easily by one thing that this storing username }
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdByUser: {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
    },
    img: {
      type: String,
    },
    role: {
      type: String,
      required: [
        false,
        'A community user must provide their role in community',
      ], // TODO This field will be marked as required true after we implement role based functionality
    },
  },
  createdByCommunity: {
    communityId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Community',
    },
    communityName: {
        type: String,
    },
  },
});

const FeedBack = mongoose.model('FeedBack', feedBackSchema);

module.exports = FeedBack;
