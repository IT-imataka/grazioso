"use client";

// import { useState } from "react";
import useReservations from "../hooks/useReservations";
// 統合されたコンポーネントのみをインポート
import Sidebar from "../components/Sidebar";
import CalendarView from "../components/CalendarView";
import ReservationList from "../components/ReservationList";
import ReservationModal from "../components/ReservationModal";

// 不要になった import を削除
// import WeeklyCalendar from "../components/WeeklyCalendar";
// import MobileNavbar from "../components/MobileNavbar";

export default function Dashboard() {

  // WeeklyCalendar用の currentDate state も不要になったので削除
  // const [currentDate, setCurrentDate] = useState(new Date());

  const {
    reservables,
    reservations,
    // 予約ボタンの開閉
    isCreateOpen,
    setCreateOpen,
    onSaveCreate,
    // 新規予約用
    selectedRevId,
    setSelectedRevId,
    startTime,
    setstartTime,
    endTime,
    setendTime,
    // 既存予約変更用
    handleEditClick,
    editId,
    setEditId,
    newstartTime,
    setnewStartTime,
    newendTime,
    setnewEndTime,
    handleCancel,
    savingchange,
  } = useReservations();


  return (
    <div className="relative !flex h-screen w-full items-center justify-center bg-[#0B1A45] text-slate-100 font-sans p-0 lg:p-8 overflow-hidden">

      {/* --- 背景の幾何学的な光の演出 --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[15%] right-[20%] w-32 h-32 bg-gradient-to-t from-yellow-500 to-orange-500 rotate-[30deg] blur-2xl opacity-90" />
        <div className="absolute top-[5%] left-[-20%] w-[50%] h-[50%] bg-cyan-600/50 rounded-full blur-[90px]" />
        <div className="absolute bottom-[-10%] left-[5%] w-72 h-72 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-[90px]" />
        <div className="absolute top-[5%] right-[10%] w-72 h-72 bg-gradient-to-br from-orange-500 to-pink-600 rotate-45 blur-4 opacity-70 mix-blend-screen" />
        <div className="absolute bottom-[5%] left-[20%] w-72 h-72 bg-gradient-to-br from-orange-500 to-pink-600 rotate-45 blur-[60px] opacity-70 rounded-full" />
        <div className="absolute bottom-[15%] left-[15%] w-32 h-32 bg-gradient-to-br from-purple-500 to-white-500/90 rotate-45 blur-[5px] rounded-full" />
        <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-cyan-600/40 rotate-12 blur-[8px] rounded-full" />
        <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-cyan-600/40 rotate-12 blur-[80px] rounded-full" />
        <div className="absolute top-[5%] right-[10%] w-72 h-72 bg-gradient-to-br from-orange-500 to-pink-600 rotate-45 blur-xs opacity-70 mix-blend-screen" />
        <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] bg-purple-600/40 rounded-full blur-[80px]" />
        <div className="absolute top-[5%] right-[10%] w-72 h-72 bg-purple-600/40 rounded-full blur-[80px]" />
        <div className="absolute bottom-[5%] left-[20%]  w-72 h-72 bg-purple-600/40 rounded-full blur-[50px]" />
        <div className="absolute bottom-[15%] right-[20%] w-32 h-32 bg-gradient-to-t from-yellow-500 to-orange-500 rotate-[30deg] blur-[40px] opacity-80" />
      </div>

      {/* === 📱 スマホ用ボトムナビゲーション === */}
      {/* Sidebarコンポーネントの中にボトムナビ機能が含まれているので、
          スマホ画面(lg:hidden)の時だけここに配置して表示させます */}
      <div className="lg:hidden">
        <Sidebar />
        {/* <MobileNavbar></MobileNavbar> */}
      </div>

      {/* メインのガラスボードコンテナ */}
      <div className="relative z-10 !flex h-full w-full max-w-[1920px] scale-100 lg:scale-95 overflow-hidden lg:rounded-[2.5rem] lg:border lg:border-white/10 lg:bg-white/[0.01] lg:shadow-2xl lg:backdrop-blur-3xl">

        {/* 💻 PC用 サイドバー */}
        {/* PC画面(lg:flex)の時はここに配置して左側に固定します */}
        <aside className="hidden lg:flex w-20 shrink-0 border-r border-white/5 bg-white/[0.02] flex-col items-center shadow-2xl">
          <Sidebar />
        </aside>

        {/* コンテンツエリア */}
        <main className="flex-1 flex flex-col p-4 lg:p-8 overflow-y-auto relative scrollbar-glass overflow-y-auto lg:overflow-hidden pb-24 lg:pb-8">

          {/* ヘッダーエリア */}
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h1 className="text-2xl lg:text-3xl font-black tracking-wide text-white drop-shadow-md">Bboard</h1>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 text-sm font-bold text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
                <div className="relative">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-11 h-6 bg-slate-700/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="hidden sm:inline">Timeline View</span>
              </label>

              <button
                onClick={() => setCreateOpen(true)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl backdrop-blur-md border border-white/20 shadow-lg transition-all active:scale-95"
              >
                New Reservation
              </button>
            </div>
          </div>

          {/* Gridレイアウト */}
          <div className="flex-1 !grid grid-cols-1 lg:grid-cols-2 gap-8 lg:overflow-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30">

            {/* カレンダーエリア */}
            {/* CalendarViewが内部でレスポンシブ対応(スマホ週表示/PC月表示)するため、ここではシンプルに配置 */}
            <section className="h-auto lg:h-full !flex flex-col min-w-0 shrink-0">
              <div className="flex-1 h-full w-full">
                <CalendarView
                  reservations={reservations}
                  // クリックされた日付でモーダルを開く
                  onSelectDate={(date) => {
                    const start = new Date(date);
                    start.setHours(9, 0, 0);
                    const end = new Date(date);
                    end.setHours(10, 0, 0);

                    const format = (fdate: Date) => {
                      const pad = (n: number) => n.toString().padStart(2, "0");
                      return `${fdate.getFullYear()}-${pad(fdate.getMonth() + 1)}-${pad(fdate.getDate())}T${pad(fdate.getHours())}:${pad(fdate.getMinutes())}`;
                    }
                    setstartTime(format(start));
                    setendTime(format(end));
                    setCreateOpen(true);
                  }}
                />
              </div>
            </section>

            {/* 予約リストエリア */}
            <section className="h-auto lg:h-full lg:overflow-y-auto min-w-0 !flex flex-col lg:rounded-[2rem] lg:bg-transparent">
              <ReservationList
                reservable={reservables}
                reservations={reservations}
                onAddClick={() => setCreateOpen(true)}
                onDelete={handleCancel}
                onEdit={handleEditClick} />
            </section>

          </div>
        </main>
      </div>

      {/* 新規予約用モーダル */}
      <ReservationModal
        reservable={reservables}
        selectedRevId={selectedRevId}
        isOpen={isCreateOpen}
        onSave={onSaveCreate}
        onClose={() => setCreateOpen(false)}
        onSet={(id) => setSelectedRevId(id)}
        startTime={startTime}
        setstartTime={setstartTime}
        endTime={endTime}
        setendTime={setendTime}
        title="新規予約"
        saveTitle="新しく予約する"
      />

      {/* 編集用モーダル */}
      <ReservationModal
        reservable={reservables}
        selectedRevId={selectedRevId}
        isOpen={!!editId}
        onSave={savingchange}
        onClose={() => setEditId(null)}
        onSet={(id) => setSelectedRevId(id)}
        startTime={newstartTime}
        setstartTime={setnewStartTime}
        endTime={newendTime}
        setendTime={setnewEndTime}
        title="予約時間の変更"
        saveTitle="変更を保存"
      />
    </div >
  );
}