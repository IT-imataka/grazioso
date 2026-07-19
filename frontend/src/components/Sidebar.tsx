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
        <div className="w-12 h-12 rounded-lg bg-[url('/logo.png')] bg-contain bg-center bg-no-repeat shadow-lg shadow-blown-500/20 shrink-0">
        </div>

        <nav className="flex flex-col gap-6 flex-1 w-full items-center">
          <button className={`w-12 h-12 rounded-lg hover:bg-[#2A1D17] hover:scale-110 transition-colors flex items-center justify-center text-[#D5BA7A] hover:text-white cursor-pointer shadow-inner
          ${isActive('/') ? 'bg-[#2A1D17] text-[#D5BA7A] -translate-y-1' : 'text-[#D5BA7A] hover:text-white'}`}>
            <Link to="/">
              <Home size={24} />
            </Link>
          </button>
          <button className={`w-12 h-12 rounded-lg hover:bg-[#2A1D17] hover:scale-110 transition-colors flex items-center justify-center text-[#D5BA7A] hover:text-white cursor-pointer shadow-inner
          `}>
            <Users size={24} />
          </button>
          <button className={`w-12 h-12 rounded-lg hover:bg-[#2A1D17] hover:scale-110 transition-colors flex items-center justify-center text-[#D5BA7A] hover:text-white cursor-pointer shadow-inner
          `}>
            <Folder size={24} />
          </button>
          <button className={`w-12 h-12 rounded-lg hover:bg-[#2A1D17] hover:scale-110 transition-colors flex items-center justify-center text-[#D5BA7A] hover:text-white cursor-pointer shadow-inner
          ${isActive('/settings') ? 'bg-[#2A1D17] text-[#D5BA7A] -translate-y-1' : 'text-[#D5BA7A] hover:text-white'}`}>
            <Link to="/settings">
              <Settings size={24} />
            </Link>
          </button>
        </nav>

        <div className="mt-auto">
          <button className={`w-12 h-12 rounded-lg hover:bg-[#2A1D17] hover:scale-110 transition-colors flex items-center justify-center text-[#D5BA7A] hover:text-white cursor-pointer shadow-inner
            `}>
            <LogOut size={24} />
          </button>
        </div>
      </div>


      {/* ================================================================
           MOBILE VIEW (lg:hidden) - ボトムナビゲーション
          ※ 既存のデザインパーツを再利用して横並びに配置
      ================================================================ */}
      <div className="lg:hidden absolute bottom-1 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div className="flex justify-around items-center bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-none rounded-full px-4 py-3 shadow-2xl">

          <Link to="/" className={`p-2 active:scale-95 transition-transform flex flex-col items-center
             ${isActive('/') ? 'text-[#2A1D17] -translate-y' : 'text-[#D5BA7A] active:scale-95'}`}>
            <div className={`p-2 rounded-lg transition-all duration-300 ${isActive('/') ? 'bg-[#EAD8C3]/20' : ''}`}>
              <Home size={24} />
            </div>
          </Link>

          <button className="p-2 text-slate-300 hover:text-white active:scale-95 transition-transform flex flex-col items-center">
            <div className="text-[#D5BA7A] p-2 rounded-lg">
              <Users size={24} />
            </div>
          </button>

          {/* 中央に強調表示するボタン（例えば新規作成など）があればここに配置できますが、今回はフラットに並べます */}
          <button className="p-2 text-slate-300 hover:text-white active:scale-95 transition-transform flex flex-col items-center">
            <div className="text-[#D5BA7A] p-2 rounded-lg">
              <Folder size={24} />
            </div>
          </button>

          <Link to="/settings" className={`p-2 active:scale-95 transition-transform flex flex-col items-center 
            ${isActive('/settings') ? 'text-[#2A1D17] -translate-y' : 'text-[#D5BA7A] active:scale-95'}`}>
            <div className={`p-2 rounded-lg transition-all duration-300 ${isActive('/settings') ? 'bg-[#EAD8C3]/20' : ''} `}>
              <Settings size={24} />
            </div>
          </Link>

        </div >
      </div >
    </>
  )
};
export default Sidebar;