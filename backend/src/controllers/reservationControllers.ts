import { Request, Response } from "express";

// ビジネスロジックをインポート
// * as で名前空間としてインポートしていたオブジェクトたちをインスタンス化された1つの箱としてインポートする
import reservationService from "../services/reservationService";
import { Reservation } from "../types/models";

export class ReservationController {
  // Expressのルータがメソッドを関数として扱ってしまうため、Controllerではアロー関数プロパティなるものを使う

  toJST = (dateSTr: string) => {
    if (dateSTr.includes("Z") || dateSTr.includes("+")) return dateSTr;
    return `${dateSTr}+9:00`;
  };
  createReservation = async (req: Request, res: Response) => {
    // Serviceで返ってきたエラーをここでハンドリングしてステータスコードを返す
    try {
      // クライアントからのjsonデータを受け取る
      // index.tsでexpress.jsonのミドルの設定をしているのでbodyにある
      // 分割代入でぶっこむ
      const { reservableId, userId, startTime, endTime,status } = req.body;

      // Serviceのビジネスロジックに渡して処理
      // 変数は同じ変数名でもう一度宣言する
      const newreservation = await reservationService.createReservation({
        reservableId,
        userId,
        startTime: this.toJST(startTime),
        endTime: this.toJST(endTime),
        status,
      });

      res.status(201).json(newreservation);
    } catch (error) {
      console.error(error);
      // ここでクライアント側に補足したエラーをステータスコードとして返す
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "予期せぬエラーが発生しました" });
      }
    }
  };

  // 全予約状況の取得
  // 受付からControllerで受け取り割り振る
  getAll = async (req: Request, res: Response) => {
    try {
      // ビジネスロジックからデータを貰う
      const Allresev = await reservationService.getAllreservations();
      res.status(200).json(Allresev);
    } catch (error) {
      // ビジネスロジックでエラーが起きても止まらないように
      console.error("エラーになります", error);
      res.status(500).json({ message: "予期せぬエラー" });
    }
  };

  // 削除したい予約の内容だけを削除する関数
  cancel = async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log("-----------------------------------------");
    console.log("【Controller到達】ID:", req.params.id);
    console.log("-----------------------------------------");
    // ここで代入したidはexpressの仕様上未設定もあり得るらしい。なので存在確認をして早期returnを必ず挟む
    if (!id) {
      res.status(400).json({ message: "IDが必要です" });
      return;
    }
    try {
      const isDeleted = await reservationService.cancelReservation(id);
      // ② 削除できなかった（IDがなかった）場合は、ここで404を返す
      if (!isDeleted) {
        console.log("❌ IDが見つからないため 404 を返します");
        res.status(404).json({ message: "Reservation not found" });
        return;
      }
      console.log("✅ 削除成功 204 を返します");
      res.status(204).send();
    } catch (error) {
      console.error("🔥 予期せぬエラー発生:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // 更新したい予約の内容だけを更新する関数
  update = async (req: Request, res: Response) => {
    // 更新する情報を用意する
    const idstr = req.params.id;
    // console.log("id", id);
    const { startTime, endTime } = req.body;
    // console.log("【Controller】受け取ったID:", id);
    // console.log("【Controller】受け取ったBody:", req.body);
    // ガード節
    if (!idstr || !startTime || !endTime) {
      res.status(400).json({ message: "id,startTime,endTimeは必須です" });
      return;
    }
    const id = Number(idstr);
    try {
      const update = await reservationService.updateReservation(
        id,
        this.toJST(startTime),
        this.toJST(endTime),
      );
      if (!update) {
        console.log("IDが見つからないため 404 を返します");
        res.status(404).json({ message: "Reservation not found" });
        return;
      }
      res.status(200).json(update);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
export default new ReservationController();
