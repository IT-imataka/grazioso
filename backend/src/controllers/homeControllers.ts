import { Request } from "express";
import { Response } from "express";
// import findAll from "../repositories/reservableRepositories";
import reservableService, {
  ReservableService,
} from "../services/reservableService";

// Controllers で実際のリクエストとレスポンスを捌く
export const getHome = async (req: Request, res: Response) => {
  // 関数として置いていた従来から、クラスへ変更したためエラーハンドリングもインスタンス化も必要

  const reservableService = new ReservableService();

  try {
    const data = await reservableService.getAllreservable();
    res.json(data);
  } catch (error) {
    console.error("データの取得に失敗しました", error);
  }
};
