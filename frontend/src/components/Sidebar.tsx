import { Home, Users, Folder, Settings, LogOut } from 'lucide-react';
// import path from 'path';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  // パス判定用
  const isActive = (path: string) => location.pathname === path;
  return (
    <>
      {/* ================================================================
       PC VIEW (hidden lg:flex) - 
      ================================================================ */}
      {/* v0: w-24 bg-gradient-to-b ... */}
      <div className="hidden lg:flex w-full bg-gradient-to-b from-black-200/40 to-white-400/40 backdrop-blur-lg border-r border-white/10 flex-col items-center py-8 gap-8 h-full">
        {/* ロゴ代わりのアイコン: v0のデザイン (rounded-lg, textあり) を適用 */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
          <span className="text-white font-bold text-lg">B</span>
        </div>

        <nav className="flex flex-col gap-6 flex-1 w-full items-center">
          {/* 各ボタン: v0のスタイル (w-12 h-12 rounded-lg bg-slate-700/30...) を適用 */}
          <button className="w-12 h-12 rounded-lg bg-slate-700/30 hover:bg-slate-600/40 hover:scale-110 transition-colors flex items-center justify-center text-slate-300 hover:text-white cursor-pointer shadow-inner">
            <Link to="/">
              <Home size={24} />
            </Link>
          </button>
          <button className="w-12 h-12 rounded-lg bg-slate-700/30 hover:bg-slate-600/40 hover:scale-110 transition-colors flex items-center justify-center text-slate-300 hover:text-white cursor-pointer">
            <Users size={24} />
          </button>
          <button className="w-12 h-12 rounded-lg bg-slate-700/30 hover:bg-slate-600/40 hover:scale-110 transition-colors flex items-center justify-center text-slate-300 hover:text-white cursor-pointer">
            <Folder size={24} />
          </button>
          <button className="w-12 h-12 rounded-lg bg-slate-700/30 hover:bg-slate-600/40 hover:scale-110 transition-colors flex items-center justify-center text-slate-300 hover:text-white cursor-pointer">
            <Link to="/settings">
              <Settings size={24} />
            </Link>
          </button>
        </nav>

        <div className="mt-auto">
          <button className="w-12 h-12 rounded-lg bg-slate-700/30 hover:bg-slate-600/40 hover:scale-110 transition-colors flex items-center justify-center text-slate-300 hover:text-white cursor-pointer">
            <LogOut size={24} />
          </button>
        </div>
      </div>


      {/* ================================================================
           MOBILE VIEW (lg:hidden) - ボトムナビゲーション
          ※ 既存のデザインパーツを再利用して横並びに配置
      ================================================================ */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div className="flex justify-around items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 shadow-2xl">

          <Link to="/" className={`p-2 active:scale-95 transition-transform flex flex-col items-center
             ${isActive('/') ? 'text-blue-400 -translate-y-1' : 'text-slate-300 hover:text-white active:scale-95'}`}>
            <div className={`p-2 rounded-lg transition-all duration-300 ${isActive('/') ? 'bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-700/30'}`}>
              <Home size={24} />
            </div>
          </Link>

          <button className="p-2 text-slate-300 hover:text-white active:scale-95 transition-transform flex flex-col items-center">
            <div className="bg-slate-700/30 p-2 rounded-lg">
              <Users size={24} />
            </div>
          </button>

          {/* 中央に強調表示するボタン（例えば新規作成など）があればここに配置できますが、今回はフラットに並べます */}
          <button className="p-2 text-slate-300 hover:text-white active:scale-95 transition-transform flex flex-col items-center">
            <div className="bg-slate-700/30 p-2 rounded-lg">
              <Folder size={24} />
            </div>
          </button>

          <Link to="/settings" className={`p-2 active:scale-95 transition-transform flex flex-col items-center ${isActive('/settings') ? 'text-blue-400 -translate-y-1' : 'text-slate-300 hover:text-white active:scale-95'}`}>
            <div className={`p-2 rounded-lg transition-all duration-300 ${isActive('/settings') ? 'bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-700/30'} `}>
              <Settings size={24} />
            </div>
          </Link>

        </div >
      </div >
    </>
  )
};
export default Sidebar;