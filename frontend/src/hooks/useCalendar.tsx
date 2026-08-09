import { useState } from "react";
// import type { Reservation } from '../api/reservationApi';

type Props = {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

export default function useCalendar ({ currentMonth,setCurrentMonth }: Props) {
  // ==========================================
  // 💻 既存のロジック (PC用・月表示)
  // ==========================================
//   const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeDate, setactiveDate] = useState<Date | null>(null);

  // 当月末日の取得関数
  const getDateInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  // 当月の月初の曜日の取得関数
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // 先月の描画関数
  const preMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newDate);
    setCurrentWeekStart(newDate);
  }
  // 来月の描画関数
  const nexMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newDate);
    setCurrentWeekStart(newDate);
  }

  // 月末日
  const daysInMonth = getDateInMonth(currentMonth);
  // 月初の曜日
  const firstDay = getFirstDayOfMonth(currentMonth);
  const prevMonthDate = getDateInMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  const TOTAL_DAYS = 35;
  const MONTHS_LENAGE = 12;

  const days = [];
  // 当月日付の生成
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDate - i, currentMonth: false });
  }
  // 当月曜日の生成
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, currentMonth: true });
  }
  // 当月日付セルの生成
  for (let i = 1; days.length < TOTAL_DAYS; i++) {
    days.push({ day: i, currentMonth: false });
  }

  const monthYear = currentMonth.toLocaleString('ja-JP', { year: 'numeric', month: 'long' })
  const weekDays = ['日', '月', '火', '水', '木', '金', '土']

  // ==========================================
  // 📱 追加ロジック (スマホ用・週表示,月表示)
  // ==========================================
  // 週の開始日
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date()); 
  // console.log("🌟 現在のリスト用月:", currentMonth.getMonth() + 1, "月");
  // console.log("📱 現在のスマホ用月:", currentWeekStart.getMonth() + 1, "月");
  
  // 月のドロップダウン
  const [isMonthOpen, setisMonthOpen] = useState(false);
  const year = currentMonth.getFullYear();

  // 今週の日付配列を生成する関数
  const getWeekDays = () => {
    const week = [];
    const start = new Date(currentWeekStart);
    // 日曜日を基準にセット 今日の日付の添字から曜日の添字を引くことで、その週初めの日付を返し続けるようにする
    // console.log(start.getDay()); console.log(start.getDate());
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < TOTAL_DAYS; i++) {
      // 一度Date型を持つ別の変数に格納せず、仮にstartをsetDateし続け、startをpushした場合
      // ループの回数分週初めの日付に対して加算し続け、最終的に5週間後のループの最後の日付である値がpushされ続けることになる
      const d = new Date(start);
      // 週初めの日付に対して一定にループ分加算
      d.setDate(start.getDate() + i);
      week.push(d);
    }
    return week;
  };
  const weekDates = getWeekDays();
  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // 先週へ
  const preWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };
  // 来週へ
  const nextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };
  // 月選択へ
    const monthList = Array.from({length : MONTHS_LENAGE},(_,i) => {
      return new Date(year,i,1);
    }
    )

      return {
        // currentMonth,
        // setCurrentMonth,
        activeDate,
        setactiveDate,
        getDateInMonth,
        getFirstDayOfMonth,
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
      }
}