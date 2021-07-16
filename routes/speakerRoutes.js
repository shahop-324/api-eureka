const express = require("express");

const authController = require("../controllers/authController");
const speakerController = require("../controllers/speakerController");
const router = express.Router();

router.get(
  "/:id",
  authController.protectCommunity,
  speakerController.getParticularSpeaker
);

router.patch(
  "/:id/update",
  authController.protectCommunity,
  speakerController.updateSpeaker
);

router.delete(
    "/:id/delete",
    authController.protectCommunity,
    speakerController.DeleteSpeaker
  );

module.exports = router;
