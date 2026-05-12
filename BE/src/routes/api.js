const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleWare");

const initAPI = (app) => {
  router.get("/user/profile", verifyToken, profileController.userProfile);
  router.put("/user/profile", verifyToken, profileController.updateUserProfile);
  router.get(
    "/admin/profile",
    verifyToken,
    authorizeRole("admin"),
    profileController.adminProfile,
  );

  return app.use("/", router);
};

module.exports = initAPI;
