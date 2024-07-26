const express = require("express");
const router = express.Router();
const previousCloseController = require("../../controllers/previousCloseController");

router
  .route("/")
  .get(previousCloseController.getAllPreviousCloses)
  .post(previousCloseController.createNewPreviousClose)
  .put(previousCloseController.updatePreviousClose)
  .delete(previousCloseController.deletePreviousClose);

router.route("/:id").get(previousCloseController.getPreviousClose);

module.exports = router;
