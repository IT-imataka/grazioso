// コントローラーの役割はrouterきたリクエストを捌いてserviceに渡して戻りにラベルをつけるイメージ
// 必要なもの req,res service,型定義
import { Request, Response } from "express";
import reservableService, {
  ReservableService,
} from "../services/reservableService";
import { Reservable } from "../types/models";

export class ReservableController {
  // コンストラクタのため明示的に！
  public Service: ReservableService;
  constructor() {
    this.Service = new ReservableService();
  }
  // 作成
  create = async (req: Request, res: Response) => {
    // エラーハンドリング
    try {
      // bodyから取ってきて、代入し直す 覚えておく
      // const { id, name, type, isActive } = req.body;
      const { name, type, isActive } = req.body;
      // serviceに渡して処理してもらうだけだから、分割代入の値を入れるだけ
      const newReservable = await reservableService.CreateReservale({
        // id,
        name,
        type,
        isActive,
      });
      // 返ってきたものをrouterに渡す その際のステータスコードの設定
      res.status(201).json(newReservable);
    } catch (error) {
      console.error("予約対象を登録できませんでした", error);
      // サーバー側かクライアント側か区別する
      if (error instanceof Error) {
        // エラーメッセージでの判定を一度とおす
        if (error.message === "既に設定されています") {
          // ユーザのミスかどうか
          return res.status(400).json({ message: error.message });
        }
      }
      // それ以外はすべてサーバーの責任
      res.status(500).json({ message: "予期せぬエラーが発生しました" });
    }
  };

  // 取得
  getAll = async (req: Request, res: Response) => {
    // エラーハンドリング
    try {
      const allReservable = await reservableService.getAllreservable();
      // ステータスコードの設定とrouterへの返還
      return res.status(200).json(allReservable);
    } catch (error) {
      console.error("設定項目を表示できませんでした", error);
      return res.status(500).json({ message: "予期せぬエラーが発生しました" });
    }
  };

  // 削除
  delete = async (req: Request, res: Response) => {
    // エラーハンドリング
    try {
      // 受け取ったリクエストを渡すために保存するのは大体分割代入とこれ？
      const id = req.params.id;
      // console.log(req);
      // idとかは必ず存在チェック！
      if (!id) return;
      const delReservable = await reservableService.DeleteReservable(id);
      // 削除できたか、できていないかの判定も必要
      if (!delReservable) {
        console.log("削除に失敗しました");
        return res.status(404).json({ message: "reservable not found" });
      } else {
        console.log("削除に成功しました");
        return res.status(204).send();
      }
    } catch (error) {
      console.error("予期せぬエラーが発生しました", error);
      return res.status(500).json({ message: "server error" });
    }
  };

  // 更新
  update = async (req: Request, res: Response) => {
    // エラーハンドリング
    try {
      // 受け取ったリクエストを渡すために保存するのは大体分割代入とこれ？
      const idstr = req.params.id;
      // console.log("ステータス", res.status);
      const { name, type, isActive } = req.body;

      // 存在チェックにもステータスコードの設定が必要
      if (!idstr || !name || !type || !isActive) {
        res
          .status(404)
          .json({ message: "入力情報に誤りがあるか、不足があります" });
        return;
      }
      const id = Number(idstr);
      const updReservable = await reservableService.UpdateReservable(
        id,
        name,
        type,
        isActive,
      );
      // 更新できたか、できていないかの確認
      if (!updReservable) {
        console.log("更新に失敗しました");
        res.status(404).json({ message: "failed update" });
        return;
      }
      // 更新成功時は更新内容をクライアントに返すため 200 を返す
      // 204 はボディを持てないため、フロントでの json() 呼び出しで失敗する原因になる
      return res.status(200).json(updReservable);
    } catch (error) {
      console.error("エラーが発生しました", error);
      return res.status(500).json({ message: "server error" });
    }
  };
}
export default new ReservableController();
