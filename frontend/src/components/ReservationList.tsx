//App.tsxの子コンポーネント 

// propsをインラインで受け取る記法の練習
import { type Reservation, type Reservable } from "../api/reservationApi";
import { useMemo } from 'react';
import ReservationCard from "./ReservationCard";
// import { Calendar as CalendarIcon } from 'lucide-react';

// 1.関数を渡しますと宣言
// 2.該当の子コンポーネントに引数が渡されているか、その型定義がなされているかを確認しにいく
// 3.その子コンポーネントの中の孫コンポーネントにしっかり配線されているか
const ReservationList = ({ activeDate, currentMonth, reservations, reservable, onDelete, onEdit, onAddClick, }:
  { activeDate: Date | null, currentMonth: Date; reservations: Reservation[], reservable: Reservable[], onDelete: (id: number) => void, onEdit: (reservation: Reservation) => void, onAddClick: () => void }) => {
    // console.log("今リストに渡ってきている月は：",currentMonth);
    const reservableMap = useMemo(
      () => new Map((reservable ?? []).map((r) => [String(r.id), r])),
      [reservable],
    );

    // visibleReservations: activeDate が指定されていればその日の予約のみ抽出
    const visibleReservations = useMemo(() => {

      // 非選択時は今月のリストのみ表示
      const isSameMonth = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth();
      if (!activeDate) {
        // const today = new Date();
        return reservations.filter(reservation => isSameMonth(new Date(reservation.startTime), currentMonth))
      }

      // 選択時はその日付のみリストに表示
      const isSameDate = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
      return reservations.filter((reservation) => isSameDate(new Date(reservation.startTime), activeDate));
      
    }, [reservations, activeDate, currentMonth]);

    // トップレベルに近い位置でmapからのfilterで型安全に担保された配列を作成しておく
    const entries = visibleReservations
      .map((reservation) => ({ reservation, target: reservableMap.get(String(reservation.reservableId)) }))
      .filter((e): e is { reservation: Reservation; target: Reservable } => Boolean(e.target));

    const titleText = activeDate ? `${activeDate.getMonth() + 1}月${activeDate.getDate()}日 予約状況` : `予約一覧` ;
    if (!reservable || !reservations) return <div>読み込み中</div>
          
  return (
    // propsはタグを属性として渡すのではなく、要素として中身を展開する
    <div className="flex-1 bg-white/40 rounded-2xl p-8 shadow-2xl overflow-y-auto flex flex-col h-full border border-white/20 ">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0 flex-wrap">
        <h2 className="text-2xl font-bold text-[#2A1D17]">{titleText}</h2>

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
        <span className="text-xm font-semibold text-[#2A1D17]">Total: {entries.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-thumb]:bg-transparent/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/80">
        {entries.map(({ reservation, target }) => (
          <ReservationCard
            key={reservation.id}
            reservable={target}
            reservation={reservation}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      <div className="mt-4 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 shrink-0">
        Selected Date: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  )
};
export default ReservationList;