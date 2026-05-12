const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimiter");
const { validateLogin } = require("../middleware/validator");

const initAuthRoute = (app) => {
  router.get("/login", authController.getLogin);
  router.post("/register", authController.register);
  router.post("/login", loginLimiter, validateLogin, authController.login);
  router.post("/google", authController.googleLogin);
  router.post("/forgot-password", authController.forgotPassword);
  router.post("/reset-password", authController.resetPassword);
  return app.use("/api/auth", router);
};
module.exports = initAuthRoute;
