const express = require("express");
const router = express.Router();

const contacts = require("../../controllers/contacts");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../utils/validation/contactValidation");

router.get("/", authenticate, contacts.listContacts);

router.get("/:id", authenticate, isValidId, contacts.getContactById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchema),
  contacts.addContact
);

router.delete("/:id", authenticate, isValidId, contacts.removeContact);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  contacts.updateContact
);

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  contacts.updateFavorite
);

module.exports = router;
