// ReservationListの子コンポーネント、App.tsxの孫コンポーネント

// type 型エイリアス定義の練習
// import { useState } from "react";
import { Monitor } from 'lucide-react';
import type { Reservation } from "../api/reservationApi";
import type { Reservable } from '../api/reservationApi';


type Props = {

  reservable?: Reservable;
  reservation: Reservation;

  //  () => {}ではなく、 () => {}なのは、nullやundefinedが入ってくる可能性を考慮してスルーしたいから
  // :() => void のままだと、引数の指定がないため、渡ってきた予約情報の何をターゲットにするのか不明、バグの元なので指定する
  onDelete: (id: number) => void;

  // onEdit :(reservation:Reservation)の理由はhooksに渡すときに内部のhandleEditIdがオブジェクト全てを参照できるようにするため。
  // reservation.idとすると、idのみを参照しに行く。onDeleteの際はそれでも問題ないが、onEditの場合は異なる
  onEdit: (reservation: Reservation) => void;
}
const ReservationCard = ({ reservation, reservable, onDelete, onEdit }: Props) => {
  // console.log(reservable);
  return (
    // v0: bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 ...
    <div className="group bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-200 flex items-center gap-4">

      {/* Icon Area: v0の w-12 h-12 rounded-lg bg-gray-200 ... */}
      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 shrink-0">
        {/* アイコンはとりあえず固定ですが、種別があれば分岐可能 */}
        <Monitor size={24} />
      </div>

      {/* Content Area: flex-1 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h3 className="font-semibold text-gray-800 truncate text-sm">
            {/* 名称（会議室の名前など） */}
            {reservable?.name ?? "未設定"}
            {/* {reserveble.type} */}
          </h3>
          {/* Status Badge: v0のスタイル (text-xs font-semibold px-3 py-1 rounded-full) */}
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-600 shrink-0">
            予約中
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-0.5">
          {/* {(() => { console.log("届いている時間データ:", reservation.startTime); return null })()} */}
          {new Date(reservation.startTime).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}
          - {new Date(reservation.endTime).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}</div>
        <div className="text-sm font-medium text-gray-700">
          {new Date(reservation.startTime).toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit', timeZone: "Asia/Tokyo" })}
          - {new Date(reservation.endTime).toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit', timeZone: "Asia/Tokyo" })}
        </div>

        {/* Edit/Delete Buttons:既存のロジック通り配置（ホバーで表示） */}
        <div className="flex gap-2 mt-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(reservation)} className="text-sm font-bold text-blue-500 hover:text-blue-700">編集<span className="text-xs pl-2 block text-center">Edit</span></button>
          <button onClick={() => onDelete(reservation.id)} className="text-sm font-bold text-red-400 hover:text-red-600">削除<span className="text-xs pl-2 block text-center">Delete</span></button>
        </div>
      </div>

      {/* Avatar Area: v0の w-12 h-12 rounded-full border-2 ... */}
      {/* ユーザーアバター画像がないため、userIdのイニシャルを表示 */}
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0 bg-gray-100 flex items-center justify-center">
        {/* <img src={...} /> の代わりに文字を表示 */}
        <span className="text-xs text-gray-500 font-bold truncate px-1">
          {reservation.userId || "User"}
        </span>
      </div>

    </div>
  )
};
export default ReservationCard;