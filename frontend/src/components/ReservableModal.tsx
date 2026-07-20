// こちらはinterfaceで定義する記法の練習

import { X } from 'lucide-react';
// いらん これらがあると、状態を共有しないReactは別の状態として扱ってしまう
// import { useReservables } from '../hooks/useReservables';
// import useReservations from '../hooks/useReservations';
import type { Reservable } from '../api/reservationApi';
import { useState, useEffect } from 'react';
// import { useReservables } from '../hooks/useReservables';

interface Props {
  // 新規予約でも使いまわすためにpropsを汎用化
  reservable: Reservable[];
  selectedRevId: number | null;
  // setSelectedRevId: (id: number | null) => void;
  isOpen: boolean;
  onSave: (name: string, type: "MAN" | "WOMAN") => void;
  onClose: () => void;
  // onSet: (num: number) => void;
  // もらうpropsの名前は知らなくてよい
  title?: string;
  saveTitle?: string;
  changeTitle?: string;
}

const ReservableModal = ({
  reservable,
  selectedRevId,
  // setSelectedRevId,
  isOpen, onSave, onClose,
  title = "", saveTitle = "", changeTitle = "" }: Props) => {
  // 呼び出すために使っていたこれらも不要 後学のために残す
  // const { reservables } = useReservables();
  // const { selectedRevId, setSelectedRevId } = useReservations();
  const [name, setName] = useState<string>("");
  const [sex, setSex] = useState<"MAN" | "WOMAN">("MAN");

  // 物の更新をしたいときのstate設定
  useEffect(() => {
    if (isOpen && selectedRevId) {
      const target = reservable.find(f => f.id === selectedRevId );
      if (target) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setName(target.name);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setSex(target.sex);
      }
    } else if (isOpen && selectedRevId !== null) {
      setName("");
      setSex("MAN");
    }
    // 開閉状態、対象の選択可否状態、
  }, [isOpen, selectedRevId, reservable])

  // 開いていないときはnullで早期リターン
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景の暗幕 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="relative w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-2xl p-8 transform transition-all scale-100 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-xl font-bold text-[#2A1D17] tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full text-slate-500 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        < div className='mb-6'>
          <label htmlFor="" className='block text-xs font-medium text-slate-600 uppercase mb-2 mb-1'>{changeTitle}</label>
          {selectedRevId === null ? (
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A1D17]/50 focus:border-[#2A1D17] text-slate-700 font-medium transition-all cursor-pointer"
                placeholder="お客様のお名前を入力"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <select
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A1D17]/50 focus:border-[#2A1D17] text-slate-700 font-medium transition-all cursor-pointer"
                value={sex}
                onChange={(e) => setSex(e.target.value as "MAN" | "WOMAN")}
              >
                <option value="MAN">男性</option>
                <option value="WOMAN">女性</option>
              </select>
            </div>
          ) : (
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-500 text-slate-700 font-medium transition-all cursor-pointer"
                placeholder="名前を変更してください"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <select name="" id=""
                value={sex}
                onChange={(e) => setSex(e.target.value as "MAN" | "WOMAN")}
                className='w-full px-4 py-2 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-500 text-slate-700 font-medium transition-all cursor-pointer'>
                <option value="">選択してください</option>
                <option value="MAN">男性</option>
                <option value="WOMAN">女性</option>
              </select>
            </div>
          )}
        </div>

        {/* ボタンエリア */}
        <div className="flex justify-end gap-3 pt-2">
          {/* キャンセルボタンは上の×で代用できるため、ここは保存ボタンを強調 */}
          <button
            onClick={() => onSave(name, sex)}
            className="w-full py-3 bg-[#D5BA7A] hover:bg-[#2A1D17] text-[#2A1D17] hover:text-white font-bold rounded-xl shadow-lg shadow-[#2A1D17]/30 transition-all cursor-pointer"
          >
            {saveTitle}
          </button>
        </div>

      </div>
    </div >
  )
};

export default ReservableModal;