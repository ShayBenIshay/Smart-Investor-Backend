const PreviousClose = require("../models/PreviousClose");

const getAllPreviousCloses = async (req, res) => {
  const previousCloses = await PreviousClose.find().lean();
  if (!previousCloses?.length)
    return res.status(400).json({ message: "No Previous Closes found" });
  console.log(previousCloses);
  res.json(previousCloses);
};

const createNewPreviousClose = async (req, res) => {
  const { ticker, date, previousClose } = req.body;
  if (
    !ticker ||
    !date ||
    !previousClose.close ||
    !previousClose.high ||
    !previousClose.low ||
    !previousClose.open ||
    !previousClose.volume
  )
    return res
      .status(400)
      .json({ message: "All the fields of previous close are required." });

  try {
    const result = await PreviousClose.create({
      ticker,
      date,
      previousClose,
    });
    console.log(result);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updatePreviousClose = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const previousClose = await PreviousClose.findOne({
    _id: req.body.id,
  }).exec();
  if (!previousClose) {
    return res
      .status(204)
      .json({ message: `No previous close matched ID ${req.body.id}` });
  }
  if (req.body?.ticker) previousClose.ticker = req.body.ticker;
  if (req.body?.date) previousClose.date = req.body.date;
  if (req.body?.previousClose?.close)
    previousClose.previousClose.close = req.body.previousClose.close;
  if (req.body?.previousClose?.hight)
    previousClose.previousClose.hight = req.body.previousClose.hight;
  if (req.body?.previousClose?.low)
    previousClose.previousClose.low = req.body.previousClose.low;
  if (req.body?.previousClose?.open)
    previousClose.previousClose.open = req.body.previousClose.open;
  if (req.body?.previousClose?.volume)
    previousClose.previousClose.volume = req.body.previousClose.volume;

  const result = await previousClose.save();
  console.log(result);
  res.json(result);
};

const deletePreviousClose = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "PreviousClose ID required." });

  const previousClose = await PreviousClose.findOne({
    _id: req.body.id,
  }).exec();
  if (!previousClose) {
    return res
      .status(204)
      .json({ message: `No previousClose matched ID ${req.body.id}` });
  }
  const result = await previousClose.deleteOne({ _id: req.body.id });
  result.message = `Deleted previousClose id: ${req.body.id}`;
  console.log(result);
  res.json(result);
};

const getPreviousClose = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "PreviousClose ID required." });
  const previousClose = await PreviousClose.findOne({
    _id: req.params.id,
  }).exec();
  if (!previousClose) {
    return res
      .status(400)
      .json({ message: `PreviousClose ID ${req.params.id} not found` });
  }
  console.log(previousClose);
  res.json(previousClose);
};

module.exports = {
  getAllPreviousCloses,
  createNewPreviousClose,
  updatePreviousClose,
  deletePreviousClose,
  getPreviousClose,
};
