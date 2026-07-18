// React難しすぎるでしょ
"use client";

// Reactrルーティングの実装 遷移する先をきめる
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SettingPage from "./pages/settingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/settings" element={<SettingPage />}></Route>
    </Routes>
  )
};