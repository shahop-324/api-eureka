class apiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // filter() {
  //   const queryObj = { ...this.queryString };
  //   const excludedFields = ["page", "sort", "limit", "fields"];
  //   excludedFields.forEach((el) => delete queryObj[el]);
  //   // 1B) Advanced filtering
  //   let queryStr = JSON.stringify(queryObj);
  //   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  //   this.query = this.query.find(JSON.parse(queryStr));
  //   return this;
  // }

  textFilter() {
    if (this.queryString.text) {
      this.query = this.query
        .find({ $text: { $search: this.queryString.text } })
        .sort({ score: { $meta: "textScore" } });
    }
    return this;
  }

  categoryWiseFilter() {
    if (this.queryString.category) {
      const queryArray = this.queryString.category.split(",");
      this.query = this.query.find({ category: { $in: queryArray } });
    }

    return this;
  }

  dateWiseFilter() {
    const start_Date = new Date(this.queryString.startDate);
    const end_Date = new Date(this.queryString.endDate);
    console.log(start_Date, end_Date);
    if (this.queryString.startDate && this.query.endDate) {
      this.query = this.query.find({
        $and: [
          { startDate: { $gte: start_Date } },
          {
            endDate: { $lte: end_Date },
          },
        ],
      });
    }
    return this;
  }

  priceWiseFilter() {
    const min_price = this.queryString.min_price * 1;
    const max_price = this.queryString.max_price * 1;
    if (this.queryString.min_price && this.queryString.max_price) {
      this.query = this.query.find({
        $and: [
          {
            minTicketPrice: { $gte: min_price },
          },
          {
            maxTicketPrice: { $lte: max_price },
          },
        ],
      });
    } else if (this.queryString.max_price && max_price === 0) {
      console.log("i reached at this point");
      this.query = this.query.find({
        maxTicketPrice: max_price,
      });
    }

    return this;
  }

  paginate() {
    // console.log(this.query);
    if (this.queryString.page) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      const skip = (page - 1) * limit;
      console.log(skip);

      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}
module.exports = apiFeatures;
