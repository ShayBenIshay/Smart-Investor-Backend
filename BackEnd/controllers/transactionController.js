const Transaction = require("../model/Transaction");

const getAllTransactions = async (req, res) => {
  const transaction = await Transaction.find();
  if (!transaction)
    return res.status(204).json({ message: "No transactions found" });
  console.log(transaction);
  res.json(transaction);
};

const createNewTransaction = async (req, res) => {
  const { stock, papers, operation } = req.body;
  if (!stock.ticker || !stock.price || !stock.date || !papers || !operation)
    return res
      .status(400)
      .json({ message: "All the fields of transaction are required." });

  try {
    const result = await Transaction.create({
      stock: stock,
      papers: papers,
      operation: operation,
    });
    console.log(result);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateTransaction = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const transaction = await Transaction.findOne({ _id: req.body.id }).exec();
  if (!transaction) {
    return res
      .status(204)
      .json({ message: `No transaction matched ID ${req.body.id}` });
  }
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
  result.id = req.body.id;
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
