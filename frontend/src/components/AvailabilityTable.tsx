import React, { useState } from "react";

export default function AvailabilityTable() {
  // サンプルの7日間データ（月〜日）
  const weekDays = [
    { date: "13", day: "月" },
    { date: "14", day: "火" },
    { date: "15", day: "水" },
    { date: "16", day: "木" },
    { date: "17", day: "金" },
    { date: "18", day: "土" },
    { date: "19", day: "日" },
  ];

  // 縦軸の時間（10時〜17時）
  const hours = [10, 11, 12, 13, 14, 15, 16, 17];

  // ダミーの空き状況判定（後々APIからデータを流し込む部分）
  const getAvailabilityMark = (hour: number, dayIndex: number) => {
    // モックのように一部が〇になり、他が-になるようなサンプル条件
    const isAvailable = (hour + dayIndex) % 3 === 0 || (hour === 10 && dayIndex === 0) || (hour === 11 && dayIndex === 1);
    return isAvailable ? "○" : "-";
  };

  return (
    <div className="min-h-screen bg-[#2A1D17] text-[#D5BA7A] flex flex-col items-center py-12 px-4">

      <div className="flex items-center justify-between w-full max-w-xl mb-6 px-2 text-[#D5BA7A]">
        <button className="text-lg hover:opacity-75 transition-opacity">&lt;</button>
          <h2 className="text-xl font-bold text-[#2A1D17]" 
            onClick={() =>  setisMonthOpen(!isMonthOpen)}>
            {currentWeekStart.getFullYear()}年{currentWeekStart.getMonth() + 1}月&nbsp;▼
          </h2>
        <button className="text-lg hover:opacity-75 transition-opacity">&gt;</button>
      </div>

      {/* メインのタイムテーブル（カード枠） */}
      <div className="bg-[#3D2C22]/80 backdrop-blur-md rounded-2xl p-6 w-full max-w-xl shadow-2xl border border-[#523B2F]">
        {/* 8カラムのグリッド（Time列(1) ＋ 7曜日列(7)） */}
        <div className="grid grid-cols-8 gap-y-3 text-center items-center">
          
          {/* 左上の "Time" ヘッダー */}
          <div className="text-xs text-[#D5BA7A]/60 font-medium py-2">Time</div>
          
          {/* 曜日・日付ヘッダーの横並び */}
          {weekDays.map((w, i) => (
            <div key={i} className="py-2 flex flex-col items-center">
              <span className="text-base font-bold text-[#D5BA7A]">{w.date}</span>
              <span className="text-xs text-[#D5BA7A]/60">{w.day}</span>
            </div>
          ))}

          {/* 時間ごとの行をループ */}
          {hours.map((hour) => (
            <React.Fragment key={`hour-row-${hour}`}>
              {/* 左端の時間ラベル */}
              <div className="text-sm text-[#D5BA7A]/80 font-medium py-3">
                {hour}
              </div>

              {/* 7日分の各マス */}
              {weekDays.map((_, dayIndex) => {
                const mark = getAvailabilityMark(hour, dayIndex);
                return (
                  <div key={`cell-${hour}-${dayIndex}`} className="flex items-center justify-center py-3">
                    {mark === "○" ? (
                      <div className="w-7 h-7 rounded-full border-2 border-[#60A5FA] flex items-center justify-center text-[#60A5FA] text-sm font-bold shadow-sm">
                        ○
                      </div>
                    ) : (
                      <span className="text-[#D5BA7A]/40 text-sm font-medium">-</span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 下部の【ご案内】ボックス */}
      <div className="mt-8 bg-[#3D2C22]/80 border border-[#523B2F] rounded-xl p-5 w-full max-w-xl text-sm text-[#D5BA7A]/90 shadow-lg">
        <p className="font-bold mb-1">【ご案内】</p>
        <p className="leading-relaxed text-[#D5BA7A]/80 text-xs sm:text-sm">
          予約・ご相談は、お電話または公式LINEにて直接承ります。こちらは空き状況の確認のみ可能です。
        </p>
      </div>
    </div>
  );
}