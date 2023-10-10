const express = require("express");
const router = express.Router();

const contacts = require("../../controllers/contacts");
const { HttpError } = require("../../helpers");
const { validateBody, isValidId } = require("../../middlewares");
const { schemas } = require("../../models/contacts");

router.get("/", contacts.listContacts);

router.get("/:id", isValidId, contacts.getContactById);

router.post("/", validateBody(schemas.addSchema), contacts.addContact);

router.delete("/:id", isValidId, contacts.removeContact);

router.put(
  "/:id",
  isValidId,
  validateBody(schemas.addSchema),
  contacts.updateContact
);

router.patch(
  "/:id/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  contacts.updateFavorite
);

module.exports = router;
