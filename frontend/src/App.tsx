// React難しすぎるでしょ
"use client";

// Reactrルーティングの実装 遷移する先をきめる
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SettingPage from "./pages/settingPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
			<Route path="/" element={<Navigate to={"/availability"} replace/>}></Route>		
      <Route path="/availability" element={ <AvailabilityPage/> }></Route>
			<Route path="/login" element={ <LoginPage/> }></Route>
			
			<Route element={ <ProtectedRoute/> }>
				<Route path="/dashboard" element={ <Dashboard/> }></Route>
				<Route path="/settings" element={ <SettingPage/> }></Route>
			</Route>
    </Routes>
  )
};