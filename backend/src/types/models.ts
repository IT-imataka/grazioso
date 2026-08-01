// 予約のステータス型
export type ReservationsStatus = "pending" | "confirmed" | "cancelled" | "visited";

export const RESERVATION_STATUS_MAP : Record<ReservationsStatus, {label : string; color : string}> = {
  pending : {label : "予約中",color :"bg-orange-100 text-orange-600" },
  confirmed : {label : "確定",color :"bg-green-100 text-green-600" },
  cancelled : {label : "キャンセル",color :"bg-red-100 text-red-600" },
  visited : {label : "来店済み",color :"bg-gray-100 text-gray-600" },
}

// 1.モノ
export interface Reservable {
  id: number;
  name: string;
  sex: "MAN" | "WOMAN";
  isActive: boolean;
}

// 2.コト
export interface Reservation {
  id: number;
  // なにを
  reservableId: number;
  // 誰が
  userId: string;
  // いつ
  startTime: string;
  endTime: string;
  status : ReservationsStatus;
}
