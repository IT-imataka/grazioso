import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Reservation } from '../api/reservationApi';
import useCalendar from '../hooks/useCalendar';

type Props = {
  reservations: Reservation[];
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSelectDate: (data: Date) => void;
}

const CalendarView = ({ reservations,currentMonth, setCurrentMonth ,onSelectDate }: Props) => {
  const {
    activeDate,
    setactiveDate,
    preMonth,
    nexMonth,
    days,
    monthYear,
    weekDays,
    currentWeekStart,
    setCurrentWeekStart,
    isMonthOpen,
    setisMonthOpen,
    weekDates,
    weekDaysEn,
    preWeek,
    nextWeek,
    monthList,
  } = useCalendar({ currentMonth,setCurrentMonth });

  // 指定した日付に予約があるかどうかの関数
  const hasReservation = (target: Date) => {
    return reservations.some((val) => {
      const reserveDateYear = new Date(val.startTime).getFullYear();
      const reserveDateMonth = new Date(val.startTime).getMonth();
      const reserveDay = new Date(val.startTime).getDate();
      return (
        reserveDateYear === target.getFullYear() &&
        reserveDateMonth === target.getMonth() &&
        reserveDay === target.getDate()
      );
    });
  };

  // 選択された日付が現在の状態の日付と同じか判定する関数
  const isSelected = (targetDate: Date): boolean => {
    if (!activeDate) return false;
    // 比較するのはミリ秒ごと
    return (
      activeDate.getFullYear() === targetDate.getFullYear() &&
      activeDate.getMonth() === targetDate.getMonth() &&
      activeDate.getDate() === targetDate.getDate()
    );
  };

  // 日付クリック時の処理（PC・スマホ共通）
  const handleDateClick = (date: Date) => {
    onSelectDate(date);
    setactiveDate(date);
    // PCとスマホの表示月・週を同期させる
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setCurrentWeekStart(date);
  };

  return (
    // コンテナ：PCでは白カード、スマホでは背景になじむように調整するか、
    // ここでは構造を変えずにレスポンシブクラスで中身を切り替えます。
    <div className="w-full h-full md:bg-white/40 md:rounded-3xl md:p-8 md:shadow-2xl flex flex-col ">

      {/* ================================================================
          📱 スマホ表示 (lg:hidden) - 週間カレンダー
      ================================================================ */}
      <div className="block md:hidden w-full mb-2">
        {/* スマホ用ヘッダー */}
        <div className="relative flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2A1D17]" 
            onClick={() =>  setisMonthOpen(!isMonthOpen)}>
            {currentWeekStart.getFullYear()}年{currentWeekStart.getMonth() + 1}月&nbsp;▼
          </h2>
          {isMonthOpen && (
            <div className='absolute grid grid-cols-4 gap-3 mt-4 p-3 w-full top-full z-99 bg-gradient-to-r from-gray-50 to-gray-100 backdrop-blur-xs shadow-2xl rounded-2xl'>
            {monthList.map((date) => {
                const label = `${date.getFullYear()}年${date.getMonth() + 1}月`;
                return (
                  <div className="text-sm text-[#2A1D17] pb-2"
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
          <div className="flex gap-4 text-[#2A1D17]">
            <button onClick={preWeek} className="p-1 hover:text-white"><ChevronLeft size={32} /></button>
            <button onClick={nextWeek} className="p-1 hover:text-white"><ChevronRight size={32} /></button>
          </div>
        </div>

        {/* 週間グリッド (横並び) */}
        <div className="flex items-center bg-white/10 rounded-2xl p-1.5 backdrop-blur-md border border-[#2A1D17]/5 shadow-lg overflow-x-auto snap-x snap-mandatory">
          {weekDates.map((date, i) => {
            const active = isSelected(date);
            const reserved = hasReservation(date);
            return (
              <button
                key={i}
                onClick={() => handleDateClick(date)}
                className={`shrink-0 snap-center flex flex-col items-center justify-center w-[calc(100%/7)] aspect-[3/5] rounded-2xl transition-all duration-300 relative
                        ${active
                    ? "bg-[#2A1D17] shadow-[0_3px_3px_rgba(0,0,0,0.12)] scale-110 z-10 text-white"
                    : "hover:bg-white/10 text-[#2A1D17]"
                  }`}
              >
                <span className="text-lg font-bold mb-1">{date.getDate()}</span>
                <span className={`text-[10px] font-medium ${active ? "text-white" : "text-[#2A1D17]"}`}>
                  {weekDaysEn[date.getDay()]}
                </span>
                {reserved && !active && (
                  <span className="absolute bottom-2 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>


      {/* ================================================================
          💻 PC表示 (hidden lg:flex) - 既存の月間カレンダー
      ================================================================ */}
      <div className="hidden md:flex flex-col w-full h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 shrink-0">
          {/* <input type="month"> */}
          <button className="flex items-center gap-2 text-[#2A1D17] font-semibold hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
            <span>{monthYear}</span>
            <ChevronRight size={20} />
          </button>
          {/* </input> */}
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#2A1D17]"
              onClick={preMonth}>
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#2A1D17]"
              onClick={nexMonth}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 mb-4 shrink-0">
          {weekDays.map((day) => (
            <div key={day} className="h-10 flex items-center justify-center text-gray-500 font-medium text-xl">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 gap-2 relative">
          {days.map((item, index) => {
            // 含まれていない年月は最初に定義したcurrentMonthから,
            // 触れられた対象の日付を取得する この発想出なかった
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), item.day);
            const isActive = item.currentMonth && isSelected(date);
            return (
              <button
                key={index}
                onClick={() => {
                  if (!item.currentMonth) return;

                  // 共通のクリック処理に変更
                  handleDateClick(date);
                }}
                // relative: ドットの基準点にする
                // flex flex-col: 中身を縦積みにする（数字とドットの重なり制御もしやすい）
                className={`
                relative w-full h-10 sm:h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-all duration-300 
                ${!item.currentMonth ?
                    'text-slate-300 cursor-default'
                    : isActive
                      // 選択中（ホバーで濃い青にする）
                      ? 'bg-[#2A1D17] text-white shadow-lg shadow-[#2A1D17] hover:bg-[#2A1D17]/80'
                      : index % 7 === 0
                        ? 'text-red-500 hover:bg-white/50'
                        : index % 7 === 6
                          ? 'text-blue-500 hover:bg-white/50'
                          // 未選択（ホバーで白く光る）
                          : 'text-slate-700 cursor-pointer hover:bg-white/50'}`}
              >
                < span className="z-10">{item.day}</span>
                {
                  item.currentMonth && hasReservation(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), item.day)) && (
                    <div className="absolute bottom-1.5 flex items-center justify-center -space-x-1">
                      {/* // 数字の下に小さく光るc点を配置 */}
                      {/* // 選択されている日(isSelected)は背景が青なので、ドットを白くするなどの分岐を入れるとおしゃれです */}
                      <span className=" w-1 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] z-0" />
                      <span className={`w-1.5 h-1.5 bg-rose-800 rounded-full shadow-sm ring-1 ring-white/50 z-10 opacity-90`} />
                    </div>
                  )
                }
              </button>
            )
          })}
        </div>
      </div>
    </div >
  )
};
export default CalendarView;