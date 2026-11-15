import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import dotenv from "dotenv";

dotenv.config();

// Supabase Auth が発行した JWT（ログイン時のアクセストークン）を検証するミドルウェア
// - 署名は Supabase の公開鍵（JWKS）で検証するので、秘密鍵や JWT シークレットはサーバーに置かない
// - Supabase はサインアップが有効だと誰でもアカウントを作れるため、
//   「ログインしているか」だけでなく ADMIN_USER_IDS に含まれるユーザーかも確認する

const SUPABASE_URL = process.env.SUPABASE_URL;
const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

if (!SUPABASE_URL) {
  throw new Error("環境変数 SUPABASE_URL が設定されていません");
}
if (ADMIN_USER_IDS.length === 0) {
  // 未設定のまま起動すると全リクエストが 403 になるので、起動時に気づけるようにする
  console.warn("ADMIN_USER_IDS が未設定です。管理用APIはすべて拒否されます");
}

const issuer = `${SUPABASE_URL}/auth/v1`;
// 公開鍵はライブラリ側でキャッシュされるので、毎リクエスト取得しにいくわけではない
const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "認証が必要です" });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience: "authenticated",
    });

    if (!payload.sub || !ADMIN_USER_IDS.includes(payload.sub)) {
      res.status(403).json({ message: "この操作を行う権限がありません" });
      return;
    }

    res.locals.userId = payload.sub;
    next();
  } catch {
    // 期限切れ・改ざん・別プロジェクトのトークンなど
    res.status(401).json({ message: "認証の有効期限が切れたか、不正なトークンです" });
  }
};
