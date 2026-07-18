import { Router } from "express";
// import getAll from "../controllers/"
// * as で名前空間としてインポートしていたオブジェクトたちをインスタンス化された1つの箱としてインポートする
import reservationControllers from "../controllers/reservationControllers";

const router = Router();

// 予約専用の窓口を作る
// 1.予約作成
router.post("/", reservationControllers.createReservation);

// 2.予約一覧の取得
router.get("/", reservationControllers.getAll);

// 3.予約内容の削除
router.delete("/:id", reservationControllers.cancel);

// 4.予約内容の更新
router.put("/:id", reservationControllers.update);

export default router;
