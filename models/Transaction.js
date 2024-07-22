const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: "User",
  // },
  username: {
    type: String,
    required: true,
  },
  stock: {
    ticker: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  papers: {
    type: Number,
    required: true,
  },
  operation: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
