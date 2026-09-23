// こちらはinterfaceで定義する記法の練習

import { X } from 'lucide-react';
// いらん これらがあると、状態を共有しないReactは別の状態として扱ってしまう
// import { useReservables } from '../hooks/useReservables';
// import useReservations from '../hooks/useReservations';
import type { Reservable } from '../api/reservationApi';
import { RESERVATION_STATUS_MAP } from '../api/reservationApi';
import { useState } from 'react';


type ReservationModalMode = "create" | "edit";

interface Props {
  // 新規予約でも使いまわすためにpropsを汎用化
  mode?: ReservationModalMode;
  reservable: Reservable[];
  selectedRevId: number | null;
  editStatus: string;
  isOpen: boolean;
  onSave: () => void;
  onClose: () => void;
  onSet: (num: number) => void;
  onSetStatus: (str: string) => void;
  // もらうpropsの名前は知らなくてよい
  startTime: string;
  setstartTime: (value: string) => void;
  endTime: string;
  setendTime: (value: string) => void;
  title?: string;
  saveTitle?: string;
}

const ReservationModal = ({
  mode = "edit",
  reservable,
  selectedRevId,
  editStatus,
  isOpen, onSave, onClose, onSet, onSetStatus ,startTime, endTime, setstartTime, setendTime,
  title = "予約時間の変更", saveTitle = "変更を保存" }: Props) => {
  const statusEntries = mode === "create"
    ? Object.entries(RESERVATION_STATUS_MAP).filter(([statusKey]) => statusKey === "pending")
    : Object.entries(RESERVATION_STATUS_MAP);

	// 日付用と時間用のステートをモーダル内に用意
	const [startDatePart, setStartDatePart] = useState(() => startTime ? startTime.split(' ')[0] : "");
	const [startTimePart, setStartTimePart] = useState(() => startTime ? startTime.split(' ')[1] : ""); 
	const [endDatePart, setEndDatePart] = useState(() => endTime ? endTime.split(' ')[0] : "");
	const [endTimePart, setEndTimePart] = useState(() => endTime ? endTime.split(' ')[1] : ""); 
	const weekNum = 7;
	const allTimes = 16;

	// 開始時間
	// 日付のプルダウンが変えられたとき
	const handleStartDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newDate = e.target.value;
		setStartDatePart(newDate);
		// 親の setstartTime を呼んで合体させた値を教える
		setstartTime(`${newDate} ${startTimePart}`);
	};
	// 時間のプルダウンが変えられたとき
	const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newTime = e.target.value;
		setStartTimePart(newTime);
		// 親の setstartTime を呼んで合体させた値を教える
		setstartTime(`${startDatePart} ${newTime}`);
	};
	
	// 終了時間
	// 日付のプルダウンが変えられたとき
	const handleEndDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newDate = e.target.value;
		setEndDatePart(newDate);
		// 親の setendTime を呼んで合体させた値を教える
		setendTime(`${newDate} ${endTimePart}`);
	};
	// 時間のプルダウンが変えられたとき
	const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newTime = e.target.value;
		setEndTimePart(newTime);
		// 親の setendTime を呼んで合体させた値を教える
		setendTime(`${endDatePart} ${newTime}`);
	};

	const genDateoptions = () => {
		const options  = [];
		const today = new Date();

		for (let i = 0; i < weekNum; i++) { 
			const d = new Date(today);
			d.setDate(today.getDate() + i);

			const year = d.getFullYear();
			const month = String(d.getMonth() + 1).padStart(2, "0");
			const date = String(d.getDate() + 1).padStart(2, "0");
			const allString = `${year}-${month}-${date}`;

			const displayDate = `${year}/${month}/${date}`;

			options.push({value : allString, label : displayDate});
		}
		return options;
	}
	
	const genTimeoptions = () => {
		const options  = [];
		const today = new Date();

		for (let i = 0; i < allTimes; i++) { 
			const d = new Date(today);
			d.setHours(10, i * 30, 0, 0);

			const hour = String(d.getHours()).padStart(2, "0");
			const minutes = String(d.getMinutes()).padStart(2, "0");
			const timeStr = `${hour}:${minutes}`
			const displayTime = `${hour}:${minutes}`;

			options.push({value : timeStr, label : displayTime});
		}
		return options;
	}

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

        {/* 開始時間 */}
        <div className="space-y-6 relative z-10">
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-600 uppercase mb-2 mb-1">開始時間</label>
            {/* <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setstartTime(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker()}
              className="w-full px-4 py-2 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A1D17]/50 focus:border-[#2A1D17] text-slate-700 font-medium transition-all cursor-pointer"
            /> */}
						<div className='flex gap-4'>
							<select name="" id="" 
							value={startDatePart}
							onChange={handleStartDateChange}
							className="w-full px-4 py-3 text-sm rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A1D17]/50 focus:border-[#2A1D17] text-slate-700 font-medium transition-all cursor-pointer">
								<option value="">日付を選択</option>
								{genDateoptions().map((date) => (
									<option key={date.value} value={date.value}>
										{date.label}
									</option>
									))
								}
							</select>
							<select name="" id=""
							value={startTimePart} 
							onChange={handleStartTimeChange}
							className="w-full px-4 py-3 text-sm rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A1D17]/50 focus:border-[#2A1D17] text-slate-700 font-medium transition-all cursor-pointer">
								<option value="">時刻を選択</option>
								{genTimeoptions().map((time) => (
									<option key={time.value} value={time.value}>
										{time.label}
									</option>
									))
								}
							</select>
						</div>
          </div>
        </div>

        {/* 終了時間 */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-600 uppercase mb-2 mb-1">終了時間</label>
          {/* <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setendTime(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker()}
            className="w-full px-4 py-2 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A1D17]/50 focus:border-[#2A1D17] text-slate-700 font-medium transition-all cursor-pointer"
          /> */}
					<div className='flex gap-4'>
							<select name="" id="" 
							value={endDatePart}
							onChange={handleEndDateChange}
							className="w-full px-4 py-3 text-sm rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A1D17]/50 focus:border-[#2A1D17] text-slate-700 font-medium transition-all cursor-pointer">
								<option value="">日付を選択</option>
								{genDateoptions().map((date) => (
									<option key={date.value} value={date.value}>
										{date.label}
									</option>
									))
								}
							</select>
							<select name="" id="" 
							value={endTimePart} 
							onChange={handleEndTimeChange}
							className="w-full px-4 py-3 text-sm rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A1D17]/50 focus:border-[#2A1D17] text-slate-700 font-medium transition-all cursor-pointer">
								<option value="">時刻を選択</option>
								{genTimeoptions().map((time) => (
									<option key={time.value} value={time.value}>
										{time.label}
									</option>
									))
								}
							</select>
						</div>
        </div>

        <div className='mb-6'>
          <label htmlFor="" className='block text-xs font-medium text-slate-600 uppercase mb-2 mb-1'>お客様を選択</label>
          <select name="" id=""
            value={selectedRevId ?? ""}
            onChange={(e) => {
              // setSelectedRevId(Number(e.target.value))
              const newval = Number(e.target.value);
              onSet(newval)
            }}
            className='w-full px-4 py-2 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A1D17]/50 focus:border-[#2A1D17] text-slate-700 font-medium transition-all cursor-pointer'>
            <option value="">選択してください</option>
            {reservable.map((items) => (
              <option key={items.id} value={items.id}>
                {items.name}
              </option>
            ))}
          </select>
        </div>
      
        <div className='mb-6'>
          <label htmlFor="" className='block text-xs font-medium text-slate-600 uppercase mb-2 mb-1'>ステータスを選択</label>
          <select name="" id=""
            value={editStatus}
            onChange={(e) => {
              const newStatus = e.target.value;
              onSetStatus(newStatus)
            }}
            className='w-full px-4 py-2 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A1D17]/50 focus:border-[#2A1D17] text-slate-700 font-medium transition-all cursor-pointer'>
            <option value="">選択してください</option>
            {statusEntries.map(([statusKey, statusValue]) => (
              <option key={statusKey} value={statusKey}>
                {statusValue.label}
              </option>
            ))}
          </select>
        </div>

        {/* ボタンエリア */}
        <div className="flex justify-end gap-3 pt-2">
          {/* キャンセルボタンは上の×で代用できるため、ここは保存ボタンを強調 */}
          <button
            onClick={onSave}
            className="w-full py-3 bg-[#D5BA7A] hover:bg-[#2A1D17] text-[#2A1D17] hover:text-white font-bold rounded-xl shadow-lg shadow-[#2A1D17]/30 transition-all cursor-pointer"
          >
            {saveTitle}
          </button>
        </div>

      </div>
    </div>
  )
};

export default ReservationModal;