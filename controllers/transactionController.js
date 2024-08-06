const Transaction = require("../models/Transaction");
const PreviousClose = require("../models/PreviousClose");
const jwtDecode = require("jwt-decode").jwtDecode;
const axios = require("axios");
const { format } = require("date-fns");

const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find().lean();
  if (!transactions?.length)
    return res.status(400).json({ message: "No transactions found" });
  console.log(transactions);
  res.json(transactions);
};

const createNewTransaction = async (req, res) => {
  const { jwt } = req.cookies;
  console.log(req.cookies);
  const decoded = jwtDecode(jwt);
  const { username } = decoded;
  const { stock, papers, operation } = req.body;
  if (!stock.ticker || !stock.price || !stock.date || !papers || !operation)
    return res
      .status(400)
      .json({ message: "All the fields of transaction are required." });

  try {
    const todayDate = format(new Date(), "dd/MM/yyyy");
    const foundPreviousClose = await PreviousClose.findOne({
      ticker: stock.ticker,
      date: todayDate,
    });
    let result;
    if (!foundPreviousClose) {
      const { data: prevClose } = await axios.get(
        `https://api.polygon.io/v2/aggs/ticker/${stock.ticker}/prev?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`
      );
      console.log(prevClose);
      if (prevClose.queryCount === 0) {
        return res.status(400).json({
          message: `ticker ${stock.ticker} has no data availabe. transaction did not save.
          contact shaybishay@gmail.com for more information`,
        });
      }
      const prevCloseResult = await PreviousClose.create({
        ticker: stock.ticker,
        date: todayDate,
        previousClose: {
          close: prevClose.results[0].c,
          high: prevClose.results[0].h,
          low: prevClose.results[0].l,
          open: prevClose.results[0].o,
          volume: prevClose.results[0].v,
        },
      });
      console.log(prevCloseResult);
    }
    result = await Transaction.create({
      username,
      stock,
      papers,
      operation,
    });
    console.log(result);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateTransaction = async (req, res) => {
  console.log(req.body);
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const transaction = await Transaction.findOne({ _id: req.body.id }).exec();
  if (!transaction) {
    return res
      .status(204)
      .json({ message: `No transaction matched ID ${req.body.id}` });
  }
  if (req.body?.username) transaction.username = req.body.username;
  if (req.body?.stock?.ticker) transaction.stock.ticker = req.body.stock.ticker;
  if (req.body?.stock?.price) transaction.stock.price = req.body.stock.price;
  if (req.body?.stock?.date) transaction.stock.date = req.body.stock.date;
  if (req.body?.papers) transaction.papers = req.body.papers;
  if (req.body?.operation) transaction.operation = req.body.operation;

  const result = await transaction.save();
  console.log(result);
  res.json(result);
};

const deleteTransaction = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Transaction ID required." });

  const transaction = await Transaction.findOne({ _id: req.body.id }).exec();
  if (!transaction) {
    return res
      .status(204)
      .json({ message: `No transaction matched ID ${req.body.id}` });
  }
  const result = await transaction.deleteOne({ _id: req.body.id });

  const { ticker, date } = transaction.stock;
  console.log(ticker, date);
  const otherTransaction = await Transaction.exists({
    "stock.ticker": ticker,
  });
  console.log(otherTransaction);
  let prevDeleteRes = "";
  if (!otherTransaction) {
    await PreviousClose.deleteOne({ ticker });
  } else {
    prevDeleteRes = `was not deleted (${otherTransaction._id})`;
  }
  console.log(prevDeleteRes);
  result.message = `Deleted transaction id: ${req.body.id} and previousClose ${prevDeleteRes}`;
  console.log(result);

  res.json(result);
};

const getTransaction = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Transaction ID required." });
  const transaction = await Transaction.findOne({ _id: req.params.id }).exec();
  if (!transaction) {
    return res
      .status(400)
      .json({ message: `Transaction ID ${req.params.id} not found` });
  }
  console.log(transaction);
  res.json(transaction);
};

module.exports = {
  getAllTransactions,
  createNewTransaction,
  updateTransaction,
  deleteTransaction,
  getTransaction,
};
