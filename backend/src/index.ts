import express from "express";
import cors from "cors";
import homeRouter from "./routes/homeRoutes";
import resevationRouter from "./routes/reservationRoutes";
import reservableRouter from "./routes/reservableRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// ここでミドルウェアを定義することで、クライアントから来たリクエストをexpressがjsonと判断し、それをparseしてhttp bodyに引っ付ける
// ここのミドルウェアがなければ、クライアントから送られたどんなデータもただの文字列としか解釈されない
app.use(express.json());

// homeへの割り振り
app.use(homeRouter);

// 予約ルートの割り振りを実装
app.use("/reservations", resevationRouter);
// 予約対象のエンドポイント
app.use("/reservables", reservableRouter);

app.listen(port, () => {
  console.log(`サーバー起動：http://localhost:${port}`);
});
