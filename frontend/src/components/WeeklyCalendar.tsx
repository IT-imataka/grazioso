import { useState, useEffect } from 'react';

type Props = {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
};

export default function WeeklyCalendar({ currentDate, onDateSelect }: Props) {
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  // 選択された日付を含む「週」の日付リストを生成
  useEffect(() => {
    const start = new Date(currentDate);
    // 日曜日を基準に週の開始日をセット（0:日曜, 1:月曜...）
    start.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    setWeekDays(days);
  }, [currentDate]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full mb-4">
      {/* 年月表示と左右矢印 */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-bold text-white">
          {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
        </h2>
        <div className="flex gap-4 text-slate-300">
          <button className="hover:text-white">&lt;</button>
          <button className="hover:text-white">&gt;</button>
        </div>
      </div>

      {/* 曜日と日付の列 */}
      <div className="flex justify-between items-center bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 shadow-lg">
        {weekDays.map((date, i) => {
          const isSelected = date.getDate() === currentDate.getDate();
          return (
            <button
              key={i}
              onClick={() => onDateSelect(date)}
              className={`flex flex-col items-center justify-center w-10 h-16 rounded-full transition-all duration-300 ${isSelected
                ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)] scale-110"
                : "hover:bg-white/10"
                }`}
            >
              {/* 日付 */}
              <span className={`text-lg font-bold mb-1 ${isSelected ? "text-white" : "text-white"}`}>
                {date.getDate()}
              </span>
              {/* 曜日 */}
              <span className={`text-[10px] font-medium ${isSelected ? "text-blue-200" : "text-slate-400"}`}>
                {daysOfWeek[date.getDay()]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}