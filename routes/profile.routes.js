// Después (ES Modules)
import { Router } from "express";
import validateZod from "../middlewares/validateZod.js";
import { fullProfileSchema } from "../models/profile_schema.js";
import * as ctrl from "../controllers/profile.controllers.js";

const router = Router();

router.post("/", validateZod(fullProfileSchema), ctrl.createFull);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);
router.delete("/:id", ctrl.deleteProfile);

export default router;
