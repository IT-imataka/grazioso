//App.tsxの子コンポーネント 

// propsをインラインで受け取る記法の練習
import { type Reservation, type Reservable } from "../api/reservationApi";
import { useMemo } from 'react';
import ReservationCard from "./ReservationCard";
// import { Calendar as CalendarIcon } from 'lucide-react';

// 1.関数を渡しますと宣言
// 2.該当の子コンポーネントに引数が渡されているか、その型定義がなされているかを確認しにいく
// 3.その子コンポーネントの中の孫コンポーネントにしっかり配線されているか
const ReservationList = ({ reservations, reservable, onDelete, onEdit, onAddClick, }:
  { reservations: Reservation[], reservable: Reservable[], onDelete: (id: number) => void, onEdit: (reservation: Reservation) => void, onAddClick: () => void }) => {
      const reservableMap = useMemo(
      () => new Map(reservable.map((r) => [String(r.id), r])),
      [reservable],
    );
    if (!reservable || !reservations) return <div>読み込み中</div>
  return (
    // propsはタグを属性として渡すのではなく、要素として中身を展開する
    <div className="flex-1 bg-white/40 rounded-3xl p-8 shadow-2xl overflow-y-auto flex flex-col h-full border border-white/20 ">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0 flex-wrap">
        <h2 className="text-2xl font-bold text-[#2A1D17]">本日の予約状況</h2>

        <div className="flex gap-3 shrink-0 mt-2">
          {/* 新規予約ボタン */}
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#D5BA7A] hover:bg-[#2A1D17] text-[#2A1D17] hover:text-[#FFFFFF]/90 rounded-lg transition-colors font-bold shadow-md shadow-[#2A1D17]-500/30 cursor-pointer"
          >
            New Reservation
          </button>
        </div>
      </div>

      {/* 件数表示: デザインに合わせて少し控えめに配置 */}
      <div className="mb-4 px-1">
        <span className="text-xm font-semibold text-[#2A1D17]">Total: {reservations.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-thumb]:bg-transparent/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/80">
        {/** create a lookup map to avoid repeated finds and unify id types */}
        {(() => {
          return reservations.map((reservation) => {
            const target = reservableMap.get(String(reservation.reservableId));
            // console.log(reservation.id, reservation.reservableId, '->', target?.id);
            return (
              <ReservationCard
                key={reservation.id}
                reservable={target}
                reservation={reservation}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            );
          });
        })()}
      </div>

      {/* Footer Info: v0にあるフッター装飾を追加（ロジックには影響しません） */}
      <div className="mt-4 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 shrink-0">
        Selected Date: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  )
};
export default ReservationList;