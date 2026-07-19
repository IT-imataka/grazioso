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
    <div className="relative !flex h-screen w-full items-center justify-center bg-[#EAD8C3] text-slate-100 font-sans p-0 lg:p-8 overflow-hidden">
      {/* <h1 className="text-2xl font-bold mb-6">会議室・備品の管理</h1> */}

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
            <h1 className="text-xl lg:text-3xl font-black tracking-wide text-[#2A1D17] drop-shadow-md">お客様登録</h1>
            <div className="flex items-center gap-6">
            </div>
          </div>

          {/* ▼▼ レイアウト修正: flex-1 と min-h-0 を追加して、このエリアが高さいっぱいに広がるように設定 ▼▼ */}
          {/* スマホ: 1カラム(縦積み), PC: 2カラム */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-1 min-h-0 lg:overflow-hidden overflow-y-scroll ">

            {/* --- 入力フォームエリア (ガラス化) --- */}
            {/* スマホ: h-auto(中身に合わせて伸縮), PC: h-full(画面いっぱい) */}
            <div className="h-auto lg:h-full bg-gradient-to-br from-[#EAD8C3] to-[#2A1D17]/40 p-6 rounded-[2rem] shadow-xl border border-[#B1A58F]/40 backdrop-blur-md flex flex-col">
            
              <h2 className="text-lg font-bold text-[#2A1D17] mb-4 pl-1">新規登録</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="text"
                  className="bg-white/5 border border-white/10 text-white placeholder-slate-400 p-3 rounded-xl flex-1 focus:outline-none focus:border-[#2A1D17]/50 focus:bg-white/10 transition-all"
                  placeholder="お客様のお名前を入力"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <select
                  className="bg-white/5 border border-white/10 text-[#2A1D17] p-3 rounded-xl focus:outline-none focus:border-[#2A1D17]/50 [&>option]:text-slate-900 cursor-pointer"
                  value={type}
                  onChange={(e) => setType(e.target.value as "ROOM" | "EQUIPMENT")}
                >
                  <option value="ROOM">男性</option>
                  <option value="EQUIPMENT">女性</option>
                </select>
              </div>
              <button
                onClick={() => { handleRegister(name, type) }}
                className="bg-[#D5BA7A] hover:bg-[#2A1D17] text-[#2A1D17] hover:text-[#FFFFFF] px-4 py-3 rounded-xl w-full font-bold shadow-lg shadow-[#2A1D17]/30 transition-all active:scale-95"
              >
                追加する
              </button>
              {/* 入力フォームのdivの下に、これを追加 */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-[#B1A58F] text-center">
                  <div className="text-[#2A1D17] text-xs font-bold uppercase mb-1">男性</div>
                  <div className="text-3xl font-black text-blue-400">
                    {reservables.filter(r => r.type === 'ROOM').length}
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-[#B1A58F] text-center">
                  <div className="text-[#2A1D17] text-xs font-bold uppercase mb-1">女性</div>
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
        // setSelectedRevId={setSelectedRevId} //値渡しみたいなやつ
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