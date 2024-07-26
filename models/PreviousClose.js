const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const previousCloseSchema = new Schema({
  ticker: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  previousClose: {
    close: {
      type: Number,
      required: true,
    },
    high: {
      type: Number,
      required: true,
    },
    low: {
      type: Number,
      required: true,
    },
    open: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
  },
});

module.exports = mongoose.model("PreviousClose", previousCloseSchema);
