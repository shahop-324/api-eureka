const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    createdForEvent: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
    },
    createdByUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    userName: {
      type: String,
    },
    userImg: {
      type: String,
    },
    rating: {
      type: Number,
      required: [
        true,
        'A review must have a rating between 1 to 5 on a scale of 5',
      ],
      min: 1,
      max: 5,
    },
    reviewComment: {
      type: String,
      max: [300, 'A review comment can have maximum 300 characters length.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
