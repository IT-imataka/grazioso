// src/db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

// .envファイルの読み込み
dotenv.config();

const isLocal =
  process.env.DATABASE_URL?.includes("localhost") ||
  process.env.DATABASE_URL?.includes("127.0.0.1") ||
  !process.env.DATABASE_URL;

// 接続プールを作成
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/mydb",
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

// 接続確認
pool.on("connect", () => {
  console.log("データベースにつながりました");
});
export default pool;
