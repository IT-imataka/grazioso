// まずは型定義をインポート
import { Reservation } from "../types/models";

// * as で名前空間としてインポートしていたオブジェクトたちをインスタンス化された1つの箱としてインポートする
import reservationRepository from "../repositories/reservationRepositories";
import reservableRepositories from "../repositories/reservableRepositories";
import { error } from "node:console";

// クライアントからくるデータの形
type CreateReservationRequest = {
  reservableId: number;
  userId: string;
  startTime: string;
  endTime: string;
};

// public と privateの使い分け
// 今回は全てのメソッドが外から呼ばれるため、全てpublic ※TSはデフォルトでpub
// privateは、そのクラスの中だけで使う秘密道具

// 作成と加工、コントローラーに渡す
// db経由による非同期処理への書き換え
export class ReservationService {
  async createReservation(
    data: CreateReservationRequest,
  ): Promise<Omit<Reservation, "id">> {
    // こっからビジネスロジック
    // 既存予約の取得
    const allReservations = await reservationRepository.findAll();
    // 既存登録の取得
    const allRegistered = await reservableRepositories.findAll();
    // console.log(allRegistered[0]);

    // 重複チェック 既存予約それぞれにチェックを行う
    // 1. 会議室ID
    // 2. 時間

    // 会議室IDが同じの時のロジックでも悪くはないが、違う時に抜けた方がやりやすい
    for (const existing of allReservations) {
      if (String(existing.reservableId) !== String(data.reservableId)) {
        continue;
      }
      // Dateオブジェクトと文字列による型の食い違いを修正
      // DBから取得してきたデータはDateオブジェクトに変換されていることが多い。そのため渡ってきたデータとで比較すると型の不整合により
      // 判定ではfalseを返すことがある
      const newStart = new Date(data.startTime).getTime();
      const newEnd = new Date(data.endTime).getTime();
      const existStart = new Date(existing.startTime).getTime();
      const existEnd = new Date(existing.endTime).getTime();

      // 一旦会議室の時のみ重複チェックを出すように修正 find便利すぎワロタ
      const registered = allRegistered.find(
        (f) => f.id === existing.reservableId,
      );
      // if (registered?.type === "ROOM") {
      // 重複時間の領域はflagにしておく
      const overlapflag = existStart <= newEnd && newStart <= existEnd;
      // data.startTime <= existing.endTime &&
      // existing.startTime <= data.endTime;
      // console.log("確認", overlapflag);
      if (overlapflag) {
        console.error("予約が重複しています！", error);
        throw new Error("既に予約が入っています。");
      }
      // }
    }

    // 日付で自動採番
    // const newID = Date.now().toString();
    // Reservation型に成型する
    const newreservation: Omit<Reservation, "id"> = {
      // id: newID,
      reservableId: data.reservableId,
      userId: data.userId,
      startTime: data.startTime,
      endTime: data.endTime,
    };
    // リポジトリに保存
    reservationRepository.create(newreservation);

    // 作成したデータを返す
    return newreservation;
  }

  // 予約状況の表示のためリストをAPIから取得する
  // db経由による非同期処理への書き換え
  async getAllreservations(): Promise<Reservation[]> {
    return await reservationRepository.findAll();
  }

  // MVCSのためデータの保存場所を触るために一度ビジネスロジックを経由する
  // そのあとはRepoにつなげる
  async cancelReservation(id: string): Promise<boolean> {
    // const cancelId = await reservationRepository.deleteById(id);
    // if (!cancelId) {
    //   throw new Error("IDが見つかりませんでした");
    // }
    return await reservationRepository.deleteById(id);
  }

  // ビジネスロジックを経由してControllerからRepoを呼ぶ
  // 窓口作成
  async updateReservation(
    id: number,
    startTime: string,
    endTime: string,
  ): Promise<Reservation> {
    // Repoに渡す時の型にも同様にPartialを使う
    const newData: Partial<Reservation> = {
      id: id,
      startTime: startTime,
      endTime: endTime,
    };
    const updated = await reservationRepository.update(id, newData);
    if (!updated) {
      throw new Error("更新内容が見つかりません。");
    }
    return updated;
  }
}
export default new ReservationService();
