// ロジックの切り出し
"use client";

import { useEffect, useState } from "react";
import { type Reservable, type Reservation } from "../api/reservationApi";
import * as reservationAPI from "../api/reservationApi";

export default function useReservations() {
  const [reservables, setReservables] = useState<Reservable[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // normalize helper: handle different API field names like customer_id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizeReservation = (r: any): Reservation => {
    const rawRid =
      r.reservableId ?? r.customer_id ?? r.reservable?.id ?? undefined;
    const normalizedRid =
      rawRid != null && rawRid !== "" ? Number(rawRid) : undefined;
    // debug: show how rawRid converts
    // console.log("normalizeReservation", {
    //   raw: rawRid,
    //   asNumber: Number(rawRid),
    //   type: typeof rawRid,
    //   original: r,
    // });
    return {
      ...r,
      id: Number(r.id),
      reservableId: normalizedRid as unknown as number,
    } as Reservation;
  };

  // 入力フォーム用
  // 新規予約ボタン
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [startTime, setstartTime] = useState<string>("");
  const [endTime, setendTime] = useState<string>("");

  // 予約編集モーダル用
  const [editId, setEditId] = useState<number | null>(null);
  const [newstartTime, setnewStartTime] = useState("");
  const [newendTime, setnewEndTime] = useState("");

  const [selectedRevId, setSelectedRevId] = useState<number | null>(null);

  // ※1 中身
  const onSaveCreate = async () => {
    if (selectedRevId === null) {
      alert("登録タイプを選択してください");
      return;
    }
    await handleReserve(selectedRevId);
    setCreateOpen(false);
  };

  useEffect(() => {
    // 非同期でデータを貰い、Stateの更新だけを行うように変更
    const loadData = async () => {
      try {
        const reservablesData = await reservationAPI.fetchReservables();
        const reservationData = await reservationAPI.fetchReservations();

        // debug: raw payloads
        // console.log("raw reservables", reservablesData);
        // console.log("raw reservations", reservationData);

        // 受け取ったデータを数値に正規化し、画面更新
        setReservables(
          reservablesData.map((r) => ({ ...r, id: Number(r.id) })),
        );
        setReservations(reservationData.map((r) => normalizeReservation(r)));
      } catch (error) {
        console.error("データ取得エラー", error);
      }
    };
    loadData();
  }, []);

  // 予約処理
  const handleReserve = async (reserveId: number) => {
    // APIを叩く
    // 入力時刻のバリデーション
    if (!startTime || !endTime) {
      window.alert("開始時刻と終了時刻を入力してください！");
      return;
    }
    if (startTime >= endTime) {
      window.alert("終了時刻は開始時刻よりも前を設定してください");
      return;
    }
    try {
      // 処理だけさせる
      // const data = await reservationAPI.handleReserve(reserveId, startTime, endTime);
      await reservationAPI.handleReserve(
        reserveId,
        new Date(startTime).toISOString(),
        new Date(endTime).toISOString(),
      );

      // 更新されたデータを再取得
      const data = await reservationAPI.fetchReservations();
      // console.log("reservations after reserve raw:", data);
      // 受け取ったデータを数値に正規化し、画面更新
      setReservations(data.map((r) => normalizeReservation(r)));

      alert(`予約完了`);
    } catch (error) {
      console.error("エラーです", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      const message =
        apiError.response?.data?.message ||
        "予約に失敗しました（重複している可能性があります）";
      alert(message);
    }
  };

  // // 削除処理
  const handleCancel = async (reservationId: number) => {
    // if (window.confirm("本当に消しますか？")) {
    //   await fetch(`http://localhost:3000/reservations${reservationId}`, {
    //     method: "DELETE",
    //   })
    //   fetchReservations();
    // }
    // ↑でもよいが、インデントが深くなるので、ダメなら弾く、okなら通すでガード

    if (!window.confirm("本当にキャンセルしますか？")) {
      return;
    }
    try {
      await reservationAPI.handleCancel(reservationId);

      // 更新データを再取得
      const data = await reservationAPI.fetchReservations();
      // console.log("reservations after cancel raw:", data);
      // 受け取ったデータを数値に正規化し、画面更新
      setReservations(data.map((r) => normalizeReservation(r)));

      alert("キャンセル完了");
    } catch (error) {
      alert("キャンセルできませんでした");
      console.error("エラー", error);
    }
  };

  // 予約更新
  const handleUpdate = async (
    id: number,
    startTime: string,
    endTime: string,
  ) => {
    try {
      await reservationAPI.handleUpdate(
        id,
        new Date(startTime).toISOString(),
        new Date(endTime).toISOString(),
      );

      // データ再取得
      const data = await reservationAPI.fetchReservations();
      // console.log("reservations after update raw:", data);
      // 受け取ったデータを数値に正規化し、画面更新
      setReservations(data.map((r) => normalizeReservation(r)));

      alert(`予約更新完了`);
    } catch (error) {
      console.error(error);
      alert("エラー：予約を更新できませんでした");
    }
  };

  // 編集用ボタンを押した時の予約されている状態の情報をセットする関数
  const handleEditClick = (reservation: Reservation) => {
    setEditId(reservation.id);
    setnewStartTime(reservation.startTime);
    setnewEndTime(reservation.endTime);
  };

  const savingchange = async () => {
    // idの存在チェック
    console.log(editId);
    if (!editId) return;
    // 予約更新関数の実行
    if (newstartTime >= newendTime) {
      window.alert("終了時刻は開始時刻よりも前を設定してください");
      return;
    }
    await handleUpdate(editId, newstartTime, newendTime);

    setEditId(null);
  };

  return {
    reservables,
    reservations,
    // 新規予約用
    isCreateOpen,
    setCreateOpen,
    onSaveCreate,
    handleReserve,
    selectedRevId,
    setSelectedRevId,
    startTime,
    setstartTime,
    endTime,
    setendTime,
    // 予約変更用
    handleEditClick,
    editId,
    setEditId,
    newstartTime,
    setnewStartTime,
    newendTime,
    setnewEndTime,
    handleCancel,
    handleUpdate,
    savingchange,
  };
}
