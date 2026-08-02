// State と APIを分けるのがコツ

const API_BASE_PORT = 3000;
const API_env_URL =
  import.meta.env.VITE_API_URL || `http://localhost:${API_BASE_PORT}`;

export type Reservable = {
  id: number;
  name: string;
  sex: "MAN" | "WOMAN";
  isActive: boolean;
};

// 予約のステータス
export type ReservationsStatus = "pending" | "confirmed" | "cancelled" | "visited";

export const RESERVATION_STATUS_MAP : Record<ReservationsStatus, {label : string; color : string}> = {
  pending : {label : "予約中",color :"bg-orange-100 text-orange-600" },
  confirmed : {label : "確定",color :"bg-green-100 text-green-600" },
  cancelled : {label : "キャンセル",color :"bg-red-100 text-red-600" },
  visited : {label : "来店済み",color :"bg-gray-100 text-gray-600" },
}

export type Reservation = {
  id: number;
  reservableId: number;
  userId: string;
  startTime: string;
  endTime: string;
  status: ReservationsStatus;
};

// 何を予約するのかを取得する関数
export const fetchReservables = async (): Promise<Reservable[]> => {
  console.log("データ取得中...");
  const res = await fetch(`${API_env_URL}/reservables`);

  // try-catchは削除し、ここでエラーを返すように
  if (!res.ok) throw new Error("データ取得失敗");

  // const data = await res.json();
  // セットせず、値だけを返すようにリファクタ
  // setReservables(data);
  return res.json();
};

// 予約データ取得関数は、予約した時点以外にも画面を開いたタイミングでも出てくるように
export const fetchReservations = async (): Promise<Reservation[]> => {
  const res = await fetch(`${API_env_URL}/reservations`);

  if (!res.ok) throw new Error("予約データ取得失敗");

  // ここも同様に値だけを返すように
  // const data = await res.json();
  // setReservations(data);
  return await res.json();
};

// 予約処理の関数
// 時間あればまた型明示する
export const handleReserve = async (
  reserveId: number,
  startTime: string,
  endTime: string,
  status: string,
) => {
  try {
    // fetchで統一する設計思想 データの設計図をexpressに渡す
    // 誰が、いつ、どうしたいかを荷物にして伝票を送っているイメージ
    const res = await fetch(`${API_env_URL}/reservations`, {
      // 配送の種類
      method: "POST",
      // 品名
      headers: {
        "Content-type": "application/json",
      },
      // 中身
      body: JSON.stringify({
        reservableId: reserveId,
        userId: "XXXX",
        startTime: startTime,
        endTime: endTime,
        status: status,
      }),
    });
    if (!res.ok) {
      // レスポンスの中のJSONのメッセージを取り出す
      const errorData = await res.json();
      // その中身のmessageを投げる
      throw new Error(errorData.message || "予約失敗");
    }
    // データを受け取らず、値だけを返す
    // const data = await res.json();
    return await res.json();

    // 常に変わらないものは予約時に更新する必要がない(備品や会議室、プロジェクターなど)
    // × fetchReservables();
  } catch (error) {
    console.error("エラーです", error);
    throw error;
  }
};

// 削除処理の関数
// 時間あればまた型明示する
export const handleCancel = async (reservationId: number) => {
  // methodの更新だけだが,App.tsxに返すため変数に入れる
  const res = await fetch(`${API_env_URL}/reservations/${reservationId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("キャンセルできませんでした");
  return true;
};

// 予約更新
// 時間あればまた型明示する
export const handleUpdate = async (
  id: number,
  startTime: string,
  endTime: string,
  status: string,
) => {
  const res = await fetch(`${API_env_URL}/reservations/${id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      startTime: startTime,
      endTime: endTime,
      status: status,
    }),
  });
  // const data = await res.json();
  if (!res.ok) throw new Error("エラー：予約を更新できませんでした");
  return await res.json();
};
