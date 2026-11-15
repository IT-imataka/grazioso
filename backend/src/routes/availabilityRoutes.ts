import { Router } from "express";
import reservationControllers from "../controllers/reservationControllers";

const router = Router();

// お客様向け空き状況ページ用。認証なしで公開する唯一のデータAPI
router.get("/", reservationControllers.getAvailability);

export default router;
