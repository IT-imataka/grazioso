// ReservationListの子コンポーネント、App.tsxの孫コンポーネント

// type 型エイリアス定義の練習
// import { useState } from "react";
import { UserRound } from 'lucide-react';
import type { Reservable } from '../api/reservationApi';

type Props = {
  reservable: Reservable;
  // setSelectedRevId: (id: number | null) => void;
  onDelete: (id: number) => void;
  onEdit: (reservable: Reservable) => void;
}
const ReservableCard = ({ reservable, onDelete, onEdit }: Props) => {

  return (
    // v0: bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 ...
    <div className="group bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-200 flex items-center gap-4">

      {/* Icon Area: v0の w-12 h-12 rounded-lg bg-gray-200 ... */}
      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 shrink-0">
        {/* アイコンはとりあえず固定ですが、種別があれば分岐可能 */}
        <UserRound size={24} />
      </div>

      {/* Content Area: flex-1 */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-3 mb-1">
          <h3 className="font-semibold text-gray-800 truncate">
            {/* 名称（会議室の名前など） */}
            {reservable.name || "未設定"}
            <span className={reservable.sex === "MAN" ? 'block text-sm text-blue-400' : 'block text-sm text-orange-400'}>
              {/* {(() => { console.log(reservable.type); return null })()} */}
              Type：{reservable.sex}
            </span>
          </h3>
          {/* Status Badge: v0のスタイル (text-xs font-semibold px-3 py-1 rounded-full) */}
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-600 shrink-0">
            登録中
          </span>
          {/* Edit/Delete Buttons:既存のロジック通り配置（ホバーで表示） */}
          <div className="flex gap-2 mt-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(reservable)} className="text-sm font-bold text-blue-500 hover:text-blue-700">編集<span className="text-xs pl-2 block text-center">Edit</span></button>
            <button onClick={() => onDelete(reservable.id)} className="text-sm font-bold text-red-400 hover:text-red-600">削除<span className="text-xs pl-2 block text-center">Delete</span></button>
          </div>
        </div>

        {/* Edit/Delete Buttons:既存のロジック通り配置（ホバーで表示） */}
        {/* <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(reservable)} className="text-sm font-bold text-blue-500 hover:text-blue-700">編集<span className="text-xs pl-2 block text-center">Edit</span></button>
          <button onClick={() => onDelete(reservable.id)} className="text-sm font-bold text-red-400 hover:text-red-600">削除<span className="text-xs pl-2 block text-center">Delete</span></button>
        </div> */}
      </div>


    </div>
  )
};
export default ReservableCard;