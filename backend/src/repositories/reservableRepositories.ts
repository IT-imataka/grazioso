import { Reservable } from "../types/models";
import pool from "../db";

export class ReservableRepository {
  // 予約対象の登録 登録する情報：型の中身全て
  async create(reservable: Omit<Reservable, "id">): Promise<void> {
    // クエリ発行
    // SQLインジェクション対策 $1...$n
    const query =
      "INSERT INTO customers(name,sex,isActive) VALUES($1,$2,$3)";
    const values = [
      // reservable.id,
      reservable.name,
      reservable.sex,
      reservable.isActive,
    ];
    await pool.query(query, values);
  }

  // 予約対象の削除 削除する情報：id
  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM customers where id = $1";
    // プレースホルダーの挿入
    // クエリ→ $n → [id] → id: stringの順番
    const result = await pool.query(query, [id]);
    // 削除レコードを返す
    return (result.rowCount ?? 0) > 0;
  }

  // 予約対象の更新　更新する情報：name,sex ポスグレはCRUDの結果をreturningで返せる 忘れない
  async update(
    id: number,
    newData: Partial<Reservable>,
  ): Promise<Reservable | null> {
    const query =
      "UPDATE customers SET name = $2, sex = $3, isActive = $4 WHERE id = $1 RETURNING *";
    const values = [id, newData.name, newData.sex, newData.isActive];
    const result = await pool.query(query, values);

    // 更新は「何も更新しない」と「何かを更新する」両パターンあるのでreturnは必須
    // 更新は特になければという何も更新しないというnullを返してあげる
    if (result.rowCount === 0) {
      return null;
    }
    // スネークケースをキャメルケースに手動でマッピング(必要に応じて)
    // 更新するのはあくまで1つの行であって、複数行ではない
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      sex: row.sex,
      isActive: row.isActive,
    };
  }
  // 予約対象の取得　取得する情報：型の中身全て
  async findAll(): Promise<Reservable[]> {
    // 取得するクエリを発行
    const query = "SELECT * FROM customers";
    const result = await pool.query(query);

    // スネークケースからキャメルケースに変換
    const rows: Reservable[] = result.rows;

    // オブジェクトを返す場合には、{}で囲むと関数本体としてみなすためundefindedになる。()で囲む　当たり前だった
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      sex: row.sex,
      isActive: row.isActive,
    }));
  }
}
export default new ReservableRepository();
