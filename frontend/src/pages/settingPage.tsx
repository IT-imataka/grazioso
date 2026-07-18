// import { error } from "console";
import { useReservables } from "../hooks/useReservables";
import ReservableList from "../components/ReservableList";
import Sidebar from "../components/Sidebar";
import ReservableModal from "../components/ReservableModal";

export default function SettingPage() {
  const {
    reservables,
    name,
    setName,
    type,
    setType,
    editId,
    setEditId,
    isCreateOpen,
    setCreateOpen,
    selectedRevId,
    setSelectedRevId,
    handleRegister,
    deleteRegister,
    onSaveCreate,
    savingChange,
    handleEditClick, } = useReservables();
  return (
    // 画面: CSSアートに合わせた深い濃紺ベースに変更 (bg-[#0b0e1b])
    // スマホ時はp-0、PC(lg)時はp-8
    <div className="relative !flex h-screen w-full items-center justify-center bg-[#0B1A45] text-slate-100 font-sans p-0 lg:p-8 overflow-hidden">
      {/* <h1 className="text-2xl font-bold mb-6">会議室・備品の管理</h1> */}

      {/* --- 背景の幾何学的な光の演出（高発色・強配置バージョン） --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        {/* 1. 左上の青紫の巨大な光（色を濃く、不透明度アップ） */}
        <div className="absolute bottom-[15%] right-[20%] w-32 h-32 bg-gradient-to-t from-yellow-500 to-orange-500 rotate-[30deg] blur-2xl opacity-90" />

        <div className="absolute top-[5%] left-[-20%] w-[50%] h-[50%] bg-cyan-600/50 rounded-full blur-[90px]" />
        <div className="absolute bottom-[-10%] left-[5%] w-72 h-72 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-[90px]" />

        {/* 2. 右上のオレンジの菱形（鮮やかなグラデーションに変更） */}
        {/* mix-blend-screen を追加して、光っているように見せています */}
        <div className="absolute top-[5%] right-[10%] w-72 h-72 bg-gradient-to-br from-orange-500 to-pink-600 rotate-45 blur-4 opacity-70 mix-blend-screen" />
        <div className="absolute bottom-[5%] left-[20%] w-72 h-72 bg-gradient-to-br from-orange-500 to-pink-600 rotate-45 blur-[60px] opacity-70 rounded-full" />
        <div className="absolute bottom-[15%] left-[15%] w-32 h-32 bg-gradient-to-br from-purple-500 to-white-500/90 rotate-45 blur-[5px] rounded-full" />

        {/* 3. 左下の青い三角形（位置を少し上に、色を明るく） */}
        <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-cyan-600/40 rotate-12 blur-[8px] rounded-full" />
        <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-cyan-600/40 rotate-12 blur-[80px] rounded-full" />
        <div className="absolute top-[5%] right-[10%] w-72 h-72 bg-gradient-to-br from-orange-500 to-pink-600 rotate-45 blur-xs opacity-70 mix-blend-screen" />

        {/* 4. 中央右寄りの紫のオーブ（存在感を強調） */}
        <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] bg-purple-600/40 rounded-full blur-[80px]" />
        <div className="absolute top-[5%] right-[10%] w-72 h-72 bg-purple-600/40 rounded-full blur-[80px]" />
        <div className="absolute bottom-[5%] left-[20%]  w-72 h-72 bg-purple-600/40 rounded-full blur-[50px]" />

        {/* 5. 手前にある小さなオレンジの三角形（アクセント） */}
        <div className="absolute bottom-[15%] right-[20%] w-32 h-32 bg-gradient-to-t from-yellow-500 to-orange-500 rotate-[30deg] blur-[40px] opacity-80" />

        {/* 6. ノイズフィルター */}
        {/* <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"></div> */}
      </div>

      {/* スマホ時のみ表示するボトムナビ用の領域 */}
      <div className="lg:hidden">
        <Sidebar />
      </div>

      {/* メインのガラスボードコンテナ: v0の構造を維持しつつCSSアート用に微調整 */}
      {/* スマホ時はフル画面(scale-100)、PC時はscale-95 */}
      <div className="relative z-10 !flex h-full w-full max-w-[1920px] scale-100 lg:scale-95 overflow-hidden lg:rounded-[2.5rem] border-white/10 bg-white/[0.01] lg:border shadow-2xl backdrop-blur-3xl">

        {/* 左サイドバー: ガラスカードの外に出して配置 */}
        {/* スマホ時は非表示 */}
        <aside className="hidden lg:flex w-20 shrink-0 border-r border-white/5 bg-white/[0.02] flex-col items-center shadow-2xl">
          <Sidebar />
          {/* <Testfunc /> */}
        </aside>

        {/* 残りのエリア */}
        {/* PC: overflow-hidden, スマホ: overflow-y-auto */}
        <main className="flex-1 flex flex-col p-4 lg:p-8 overflow-y-auto lg:overflow-hidden pb-24 lg:pb-8">

          {/* ヘッダーエリア（タイトル） */}
          <div className="flex justify-between items-center mb-6 shrink-0">
            {/* スマホで文字が大きすぎる場合に備えてサイズ調整 */}
            <h1 className="text-xl lg:text-3xl font-black tracking-wide text-white drop-shadow-md">Bboard | 会議室・備品の管理</h1>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 text-sm font-bold text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
                <div className="relative">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-11 h-6 bg-slate-700/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="hidden sm:inline">Timeline View</span>
              </label>

              {/* <button
                onClick={() => setCreateOpen(true)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl backdrop-blur-md border border-white/20 shadow-lg transition-all active:scale-95"
              >
                New Reservation
              </button> */}
            </div>
          </div>

          {/* ▼▼ レイアウト修正: flex-1 と min-h-0 を追加して、このエリアが高さいっぱいに広がるように設定 ▼▼ */}
          {/* スマホ: 1カラム(縦積み), PC: 2カラム */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-1 min-h-0 lg:overflow-hidden overflow-y-scroll ">

            {/* --- 入力フォームエリア (ガラス化) --- */}
            {/* スマホ: h-auto(中身に合わせて伸縮), PC: h-full(画面いっぱい) */}
            <div className="h-auto lg:h-full bg-white/5 p-6 rounded-[2rem] shadow-xl border border-white/10 backdrop-blur-md flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4 pl-1">新規登録</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="text"
                  className="bg-white/5 border border-white/10 text-white placeholder-slate-400 p-3 rounded-xl flex-1 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  placeholder="例: 会議室A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <select
                  className="bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-blue-500/50 [&>option]:text-slate-900 cursor-pointer"
                  value={type}
                  onChange={(e) => setType(e.target.value as "ROOM" | "EQUIPMENT")}
                >
                  <option value="ROOM">会議室</option>
                  <option value="EQUIPMENT">備品</option>
                </select>
              </div>
              <button
                onClick={() => { handleRegister(name, type) }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl w-full font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                追加する
              </button>
              {/* 入力フォームのdivの下に、これを追加 */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">会議室</div>
                  <div className="text-3xl font-black text-blue-400">
                    {reservables.filter(r => r.type === 'ROOM').length}
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">備品</div>
                  <div className="text-3xl font-black text-orange-400">
                    {reservables.filter(r => r.type === 'EQUIPMENT').length}
                  </div>
                </div>
              </div>
            </div>

            {/* --- リスト表示エリア (スクロール対応＆ガラス化) --- */}
            {/* ▼ ここに h-full と overflow-y-auto を追加して、この箱の中でスクロールさせる ▼ */}
            {/* PC: h-full(固定高さでスクロール), スマホ: h-auto(全体スクロールの一部) */}
            <div className="h-96 lg:h-full overflow-y-auto bg-white/5 rounded-[2.5rem] border border-white/10 shadow-inner p-4 
              [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30">

              {/* リストコンポーネント */}
              <ReservableList
                reservables={reservables}
                // key={selectedRevId}
                // 沼ったポイント setSelectedRevId(null);の追加
                onAddClick={() => { setSelectedRevId(null); setCreateOpen(true); }}
                onDelete={deleteRegister}
                onEdit={handleEditClick} />
            </div>
          </div>
        </main>
      </div>

      {/* 新規登録 */}
      <ReservableModal
        // 登録リスト
        reservable={reservables}
        // リスト更新時の状態定義をpropsとして渡した方がよいと閃いた
        selectedRevId={selectedRevId}
        // setSelectedRevId={setSelectedRevId} // 値渡しみたいなやつ
        // Modalの表示可否の状態を渡す
        isOpen={isCreateOpen}
        // 新規の時はその予約を保存し、開閉状態を更新する関数としてpropsを渡す
        onSave={onSaveCreate}
        // 新規の時はfalseを宣言した状態を更新する関数を渡して閉じる
        onClose={() => { setCreateOpen(false); setSelectedRevId(null); }}
        // 参照渡しみたいなやつ
        // onSet={(id) => setSelectedRevId(id)}
        title="新規登録"
        saveTitle="新しく登録する"
        changeTitle="Name"
      ></ReservableModal>

      {/* 既存変更 */}
      <ReservableModal
        // 登録リスト
        reservable={reservables}
        // リスト更新時の状態定義をpropsとして渡した方がよいと閃いた
        selectedRevId={selectedRevId}
        // setSelectedRevId={setSelectedRevId} //　値渡しみたいなやつ
        // Modalの表示可否の状態を渡す
        isOpen={!!editId}
        onSave={savingChange}
        // 既存の時は変更対象の予約idをなかったことにして閉じる
        onClose={() => { setEditId(null); setSelectedRevId(null); }}
        // 参照渡しみたいなやつ
        // onSet={(id) => setSelectedRevId(id)}
        title="登録対象の変更"
        saveTitle="変更を保存 change save"
        changeTitle="NAME"
      ></ReservableModal>
    </div>
  );
};

// if (error) return <p style={{ color: "red" }}>{error}</p>