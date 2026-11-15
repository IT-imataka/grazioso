import { supabase } from "../lib/supabaseClient";

// 管理用APIに付ける Authorization ヘッダーを作る
// getSession はアクセストークンの期限が切れていれば自動で更新してから返してくれる
export const authHeaders = async (): Promise<Record<string, string>> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
};
