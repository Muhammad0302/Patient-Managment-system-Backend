const express = require("express");
const router = express.Router();
const HomeController = require("../app/controllers/HomeController");
const AuthController = require("../app/controllers/AuthController");

router.get("/ping", (req, res) => {
  res.status(200).send("Server is accessable !!");
});
router.get("/", HomeController.homePage);
// router.get('/login', AuthController.loginPage);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/verify", AuthController.accountVerify);
// router.get('/sign-up', AuthController.signUpPage);
router.post("/sign-up", AuthController.signUp);
// router.get('/forgot-password', AuthController.forgotPasswordPage);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.get("/user", AuthController.getUser);
const LanguageController = require("../app/controllers/LanguageController");
router.get("/lang", LanguageController.getLanguage);

const SessionController = require("../app/controllers/SessionController");
router.get("/session", SessionController.getQuestion);
router.post("/session", SessionController.saveResponse);
router.get("/session/history", SessionController.getSessions);
router.get("/session/historyById/:id", SessionController.getSessionsById);

module.exports = router;
