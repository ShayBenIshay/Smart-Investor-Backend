const express = require("express");
const router = express.Router();
const transactionController = require("../../controllers/transactionController");

router
  .route("/")
  .get(transactionController.getAllTransactions)
  .post(transactionController.createNewTransaction)
  .put(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

router.route("/:id").get(transactionController.getTransaction);

module.exports = router;
