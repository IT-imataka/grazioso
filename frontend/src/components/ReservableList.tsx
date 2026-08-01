//settingPage.tsxの子コンポーネント 

import type { Reservable } from "../api/reservationApi";
import ReservableCard from "./ReservableCard";

type Props = {
  reservables: Reservable[];
  onAddClick: () => void,
  onDelete: (id: number) => void,
  onEdit: (reservable: Reservable) => void,
}
const ReservableList = ({ reservables, onDelete, onEdit, onAddClick }: Props) => {
  return (
    // propsはタグを属性として渡すのではなく、要素として中身を展開する
    <div className="flex-1 bg-white/40 rounded-2xl p-6 shadow-2xl overflow-y-auto flex flex-col h-full border border-white/20 ">

      <div className="flex items-center justify-between mb-4 shrink-0 flex-wrap">
        <h2 className="text-2xl font-bold text-[#2A1D17]">登録状況</h2>

        <div className="flex gap-3 shrink-0">
          <button
            // ※1
            // onClick={() => { setSelectedRevId(null), onAddClick }} ← 沼ったポイント
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#D5BA7A] hover:bg-[#2A1D17] text-[#2A1D17] hover:text-[#FFFFFF]/90 rounded-lg transition-colors font-medium shadow-md shadow-[#2A1D17]/30 cursor-pointer"
          >
            New Registaration
          </button>
        </div>
      </div>

      {/* 件数表示: デザインに合わせて少し控えめに配置 */}
      <div className="mb-4 px-1">
        <span className="text-xm font-semibold text-[#2A1D17]">Total: {reservables.length}</span>
      </div>

      {/* List Area: v0の space-y-4 を適用 */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-thumb]:bg-transparent/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/80">
        {reservables.map((reservables) => (
          <ReservableCard
            key={reservables.id}
            reservable={reservables}
            onDelete={onDelete}
            onEdit={onEdit}
          />))}
      </div>

      {/* Footer Info: v0にあるフッター装飾を追加（ロジックには影響しません） */}
      <div className="mt-4 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 shrink-0">
        Selected Date: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  )
};
export default ReservableList;