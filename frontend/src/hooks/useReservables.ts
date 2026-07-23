import { useEffect, useState } from "react";
import type { Reservable } from "../api/reservationApi";
import { fetchReservables } from "../api/reservationApi";
import * as reservableAPI from "../api/reservableApi";

// 名前自由関数で
export const useReservables = () => {
  // 情報を持っておく箱
  const [reservables, setReservables] = useState<Reservable[]>([]);
  const [name, setName] = useState<string>("");
  const [sex, setSex] = useState<"MAN" | "WOMAN">("MAN");

  // モーダル用
  const [editId, setEditId] = useState<number | null>(null);
  const [isCreateOpen, setCreateOpen] = useState<boolean>(false);

  const [selectedRevId, setSelectedRevId] = useState<number | null>(null);

  // 画面描画時にレンダリング
  // フェッチしたデータで状態の更新を行う
  useEffect(() => {
    const loadData = async () => {
      try {
        const reservableData = await fetchReservables();
        setReservables(reservableData);
      } catch (error) {
        console.error("データを取得できませんでした", error);
      }
    };
    loadData();
  }, []);

  // hooksの中は処理だけさせる
  // フェッチしたデータで更新
  const handleRegister = async (name: string, sex: "MAN" | "WOMAN") => {
    try {
      if (!name) {
        window.alert("お客様のお名前は必須項目です");
        return;
      }
      // 実行
      await reservableAPI.regReservables(name, sex);
      // 更新後を取得
      const data = await fetchReservables();
      setReservables(data);
      alert("登録完了");
    } catch (error) {
      console.error("登録に失敗しました", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ApiError = error as any;
      const message = ApiError.response?.data?.message || 
      "登録に失敗しました";
      alert(message);

    }
  };

  // 削除
  // フェッチしたデータで更新
  const deleteRegister = async (id: number) => {
    if (!window.confirm("本当に削除しますか？")) {
      return;
    }
    try {
      await reservableAPI.deleteReservable(id);

      const data = await fetchReservables();
      setReservables(data);

      alert("削除完了");
    } catch (error) {
      alert("削除に失敗しました");
      console.error("削除に失敗しました", error);
    }
  };

  // 更新
  // fetchしたデータで更新 modalが開いた時にだけ実行する関数にのみ呼び出す
  const updateRegister = async (
    id: number,
    name: string,
    sex: "MAN" | "WOMAN",
  ) => {
    try {
      await reservableAPI.updateReservable(id, name, sex);
      const data = await fetchReservables();
      setReservables(data);
      alert(`更新完了`);
    } catch (error) {
      console.error("更新に失敗しました", error);
      alert("エラー：登録情報を更新できませんでした");
    }
  };

  // modalをクリックした時（編集モードを開く）
  const handleEditClick = (reservable: Reservable) => {
    // 編集対象のIDをセットし、編集モードのモーダルを開く
    // 沼
    setEditId(reservable.id);
    setSelectedRevId(reservable.id);
    setCreateOpen(false);
  };

  // modalで保存した時（新規登録用）
  const onSaveCreate = async (name: string, sex: "MAN" | "WOMAN") => {
    // 登録
    await handleRegister(name, sex);
    setSelectedRevId(null);
    // 閉じる
    setCreateOpen(false);
  };

  // modalで変更をしたとき
  const savingChange = async (name: string, sex: "MAN" | "WOMAN") => {
    // 存在チェック
    if (editId === null) {
      alert("変更対象を選んでください。例：会議室など");
      return;
    }
    if (selectedRevId !== null) {
      // 変更
      await updateRegister(editId, name, sex);
    } else {
      // 登録
      await handleRegister(name, sex);
    }
    setEditId(null);
    setSelectedRevId(null);
  };

  return {
    reservables,
    name,
    setName,
    sex,
    setSex,
    editId,
    setEditId,
    isCreateOpen,
    setCreateOpen,
    selectedRevId,
    setSelectedRevId,
    handleRegister,
    deleteRegister,
    updateRegister,
    onSaveCreate,
    savingChange,
    handleEditClick,
  };
};
