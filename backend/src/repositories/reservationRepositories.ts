// まず型定義から必要なものをインポート
import { Reservation } from "../types/models";
import pool from "../db";
import { start } from "node:repl";

export class ReservationRepository {
  // メモリ上のDB初期化
  // private reservations: Reservation[] = [];

  // 予約保存機能
  async create(reservation: Omit<Reservation, "id">): Promise<void> {
    // メモリはもう使わない
    // this.reservations.push(reservation);

    // 保存クエリ発行
    // $1~$5 プレースホルダー SQLインジェクション対策
    const query =
      "INSERT INTO reservations (customer_id,user_id,start_time,end_time,status)VALUES($1,$2,$3,$4,$5)";

    const values = [
      // reservation.id,
      reservation.reservableId,
      reservation.userId,
      reservation.startTime,
      reservation.endTime,
      reservation.status
    ];
    await pool.query(query, values);
  }

  // 予約削除機能
  async deleteById(id: string): Promise<boolean> {
    const query = `DELETE FROM reservations WHERE id = $1`;

    // プレースホルダーにidを代入
    const result = await pool.query(query, [id]);
    // rowCount に削除された行数がはいる
    // 1行以上の削除でtrue,0ならfalse
    return (result.rowCount ?? 0) > 0;
  }

  // 予約情報の更新機能
  // utility typeのPartialを使い、変更されるであろう各オブジェクトを任意にする
  async update(
    id: number,
    newData: Partial<Reservation>,
  ): Promise<Reservation | null> {
    //
    const query =
      "UPDATE reservations SET start_time = $2,end_time = $3,status = $4 WHERE id = $1 RETURNING *";

    //
    const value = [id, newData.startTime, newData.endTime, newData.status];

    const result = await pool.query(query, value);

    if (result.rowCount === 0) {
      return null;
    }

    // スネークケースをキャメルケースに
    // キャメル(key) : スネーク(value)
    const row = result.rows[0];
    return {
      id: Number(row.id),
      reservableId: Number(row.customer_id),
      userId: String(row.user_id),
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status, 
    };
  }

  // 全予約を取得する機能
  async findAll(): Promise<Reservation[]> {
    // メモリはもう使わない
    // return this.reservations;

    // 取得クエリ発行
    // 明示的に必要なカラムだけを取得し、数値/文字列の型を保証する
    const query = `SELECT id, customer_id, user_id, start_time, end_time,status FROM reservations`;
    try {
      const result = await pool.query(query);

      // debug: log raw rows to help trace upstream issues
      // console.log("reservationRepository.findAll rows:", result.rows);

      // DBのスネークケースをキャメルケースに変換しつつ型を正規化して返す
      return result.rows.map((row) => ({
        id: Number(row.id),
        reservableId: Number(row.customer_id),
        userId: String(row.user_id),
        startTime: row.start_time,
        endTime: row.end_time,
        status: row.status,
      }));
    } catch (err) {
      console.error("reservationRepository.findAll error:", err);
      return [];
    }
  }
}
export default new ReservationRepository();
