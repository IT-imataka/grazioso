import { Router } from "express";
import reservableControllers from "../controllers/reservableControllers";

const router = Router();

// ルーターによる各CRUDの制御を設定

router.get("/", reservableControllers.getAll);

router.post("/", reservableControllers.create);

router.put("/:id", reservableControllers.update);

router.delete("/:id", reservableControllers.delete);

export default router;
