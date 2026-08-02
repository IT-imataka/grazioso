"use client";

// import { useState } from "react";
import useReservations from "../hooks/useReservations";
// 統合されたコンポーネントのみをインポート
import Sidebar from "../components/Sidebar";
import CalendarView from "../components/CalendarView";
import ReservationList from "../components/ReservationList";
import ReservationModal from "../components/ReservationModal";


export default function Dashboard() {

  const {
    reservables,
    reservations,
    activeDate,
    setactiveDate,
    currentMonth,
    // setCurrentMonth,
    // 予約ボタンの開閉
    isCreateOpen,
    setCreateOpen,
    onSaveCreate,
    // 共通
    editStatus,
    setEditStatus,
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
    <div className="relative !flex h-screen w-full items-center justify-center bg-[#EAD8C3] text-slate-100 font-sans p-0 lg:p-8 overflow-hidden">

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
            <h1 className="text-2xl lg:text-xl font-black tracking-wide text-[#2A1D17] [text-shadow:0_3px_3px_rgba(0,0,0,0.12)] drop-shadow-md">Grazioso ダッシュボード</h1>
            <div className="flex items-center gap-6">
              {/* <button
                onClick={() => setCreateOpen(true)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-[#2A1D17] text-sm font-bold rounded-xl backdrop-blur-md border border-white/20 shadow-lg transition-all active:scale-95"
              >
                New Reservation
              </button> */}
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
                    setactiveDate(date);

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
                activeDate={activeDate}
                currentMonth={currentMonth}
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
        editStatus={editStatus}
        onSetStatus={setEditStatus}
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
        editStatus={editStatus}
        onSetStatus={setEditStatus}
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