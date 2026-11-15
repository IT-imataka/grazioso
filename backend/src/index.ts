import express from "express";
import cors from "cors";
import resevationRouter from "./routes/reservationRoutes";
import reservableRouter from "./routes/reservableRoutes";
import availabilityRouter from "./routes/availabilityRoutes";
import { requireAuth } from "./middlewares/requireAuth";

const app = express();
const port = process.env.PORT || 3000;

// CORS はブラウザからの呼び出し元を絞るだけで、curl などは防げない（防御の本体は requireAuth）
// ALLOWED_ORIGINS はカンマ区切り。未設定ならローカル開発用のみ許可
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));

// ここでミドルウェアを定義することで、クライアントから来たリクエストをexpressがjsonと判断し、それをparseしてhttp bodyに引っ付ける
// ここのミドルウェアがなければ、クライアントから送られたどんなデータもただの文字列としか解釈されない
app.use(express.json());

// ---- 認証なしで公開するルート ----
// 死活監視用（DBには触れない）
app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});
// お客様向けの空き状況（時間帯のみ返す）
app.use("/availability", availabilityRouter);

// ---- ここから下は管理者のみ ----
// 予約ルートの割り振りを実装
app.use("/reservations", requireAuth, resevationRouter);
// 予約対象のエンドポイント
app.use("/reservables", requireAuth, reservableRouter);

app.listen(port, () => {
  console.log(`サーバー起動：http://localhost:${port}`);
});
