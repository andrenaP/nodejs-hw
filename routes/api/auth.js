const express = require("express");

const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../utils/validation/userValidation");
const contr = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), contr.register);

router.post("/login", validateBody(schemas.loginSchema), contr.login);
router.get("/current", authenticate, contr.getCurrent);
router.post("/logout", authenticate, contr.logout);

module.exports = router;
