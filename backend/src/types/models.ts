// 予約できるモノと予約できるコトについて分ける

// 1.モノ
export interface Reservable {
  id: number;
  name: string;
  type: "ROOM" | "EQUIPMENT";
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
}
