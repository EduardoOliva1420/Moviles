// routes/profile.routes.js
const { Router } = require("express");
const validateZod = require("../middlewares/validateZod");
const { fullProfileSchema } = require("../models/profile_schema");
const ctrl = require("../controllers/profile.controllers");

const router = Router();

router.post("/", validateZod(fullProfileSchema), ctrl.createFull);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);
router.delete("/:id", ctrl.deleteProfile);

module.exports = router;