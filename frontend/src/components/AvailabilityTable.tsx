import React from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useCalendar from "../hooks/useCalendar";
import useCustomerAvailability from "../hooks/useCustomerAvailability";

type Props = {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

export default function AvailabilityTable({ currentMonth, setCurrentMonth }: Props) {
  const {
		weekDates,
		weekDaysEn,
    weekDays,
    isMonthOpen,
    setisMonthOpen,
    currentWeekStart,
    setCurrentWeekStart,
    monthList,
    preWeek,
    nextWeek,
  } = useCalendar({ currentMonth,setCurrentMonth });

  const { availability } = useCustomerAvailability(currentWeekStart);


  // 縦軸の時間（10時〜17時）
  const hours = [10, 11, 12, 13, 14, 15, 16, 17];

  // ダミーの空き状況判定（後々APIからデータを流し込む部分）
  const getAvailabilityMark = (hour: number, dayIndex: number) => {
		// 添字でエクスポートしてきた曜日の日付を取得
		// 日付を格納
		const targetDate = weekDates[dayIndex]; 
		const targetCell = new Date(targetDate);
		// 時間をリセット
		targetCell.setHours(hour,0,0,0);
		// APIから取得した日付と、格納した日付の判定
    const isReseved = availability.some(rev => {
			// ここで一度newするのは、APIから取得してくるとstringになってしまうから
			// .getTimeする理由はミリ秒比較にすることで文字列比較の時に比べて僅かな違いによる判定漏れを防ぐため
			const revStart = new Date(rev.startTime).getTime();
			const revEnd = new Date(rev.endTime).getTime();
			const cellTimest = targetCell.getTime();
			const cellTimeen = cellTimest + (60 * 60 * 1000);
			return cellTimest < revEnd && revStart <= cellTimeen;
		})

    return isReseved ? "-" : "○";
  };
	// 年と月を分けて繋ぐ方法だと、labelと比較する際に別扱いになるため繋げた状態で持っておく
	const yearmonthText = `${currentWeekStart.getFullYear()}年${currentWeekStart.getMonth() + 1}月`;

  return (
    <div className="min-h-screen bg-[#2A1D17] text-[#D5BA7A] flex flex-col items-center py-7 px-4">
      <div className="relative w-full flex justify-center mb-6">
				<div className="flex gap-20 justify-around text-white items-center">
					<button onClick={preWeek} className="p-1 hover:text-white"><ChevronLeft size={32} /></button>
          <h2 className="text-xl font-bold text-white/90"
            onClick={() =>  setisMonthOpen(!isMonthOpen)}>
            {yearmonthText}&nbsp;▼
          </h2>
          {isMonthOpen && (
            <div className='absolute grid grid-cols-4 gap-3 mt-6 p-3 w-full top-full z-99 bg-[#D5BA7A]/5 border border-white/5 backdrop-blur-md shadow-2xl rounded-2xl'>
            {monthList.map((date) => {
                const label = `${date.getFullYear()}年${date.getMonth() + 1}月`;
								const isSelected = label === yearmonthText;
                return (
                  <div className={`text-sm transition-transform duration-200 ease-in-out ${isSelected ? "scale-125 text-white/90 font-bold drop-shadow-lg" : "text-[#D5BA7A] pb-2"}`}
                  onClick={() => {
                    // console.log("今リストに渡ってきている月は：",); 
                    setCurrentMonth(date); 
                    setCurrentWeekStart(date);
                    setisMonthOpen(false);
                  }}>
                    {label}
                  </div>
                )
              })}
              </div>
          )}
            <button onClick={nextWeek} className="p-1 hover:text-white"><ChevronRight size={32} /></button>
          </div>
        </div>

      {/* メインのタイムテーブル（カード枠） */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl py-3 w-full max-w-xl shadow-2xl border border-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
        {/* 8カラムのグリッド（Time列(1) ＋ 7曜日列(7)） */}
        <div className="grid gap-y-3 text-center items-center">
          
          {/* 左上の "Time" ヘッダー */}
          <div className="grid grid-cols-8 px-3">
						<div className="text-xs text-[#D5BA7A]/60 font-medium py-2">Time</div>
						
						{/* 曜日・日付ヘッダーの横並び */}
						{weekDates.slice(0,7).map((date,index) => {
							const daynum = date.getDate();
							const daystr = weekDaysEn[date.getDay()];
							return (
								<div key={index} className="flex flex-col items-center">
									<span className="text-base">{daynum}</span>
									<span className="text-white/50 text-[10px]">{daystr}</span>
								</div>
							)
						})}
					</div>

          {/* 時間ごとの行をループ */}
          {hours.map((hour) => (
            <div key={`hour-row-${hour}`} className={`grid grid-cols-8 px-3 ${hour % 2 === 1 ? "bg-white/3 py-3" : "bg-transparent py-1"}`}>
              {/* 左端の時間ラベル */}
              <div className="text-sm text-white font-medium">
                {hour}
              </div>

              {/* 7日分の各マス */}
              {weekDays.map((_, dayIndex) => {
                const mark = getAvailabilityMark(hour, dayIndex);
                return (
                  <div key={`cell-${hour}-${dayIndex}`} className="flex items-center justify-center">
                    {mark === "○" ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#7DD3FC] flex items-center justify-center text-[#7DD3FC] text-sm font-bold shadow-sm">
                      </div>
                    ) : (
                      <span className="text-[#D5BA7A]/40 text-sm font-medium">-</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 下部の【ご案内】ボックス */}
      <div className="mt-8 bg-[#3D2C22]/80 border border-[#E5C79E]/30 rounded-xl p-5 w-full max-w-xl text-sm text-white/90 shadow-lg">
        <p className="font-bold mb-1">【ご案内】</p>
        <p className="leading-relaxed text-xs sm:text-sm">
          ご予約・ご相談は、お電話または公式LINEにて直接承ります。<br/>こちらは空き状況の確認のみ可能です。
        </p>
      </div>
    </div>
  );
}