**不具合対応レポート**

概要
- **発生日**: 2026-02-15
- **対象リポジトリ**: frontend / backend
- **症状**: 画面上の予約カード数が `Total`（reservations.length）と一致しない。特定の予約で表示される `reservable.name` が undefined になるケースがあった。

不具合内容（要点）
- 一部の `reservations` レコードが、対応する `reservables` レコードを参照していなかった（参照先 `reservable_id` が存在しない／不整合）。
- フロント側では `find` が失敗すると早期 return してカード描画をスキップしており、これにより `Total` と実際に描画されるカード数に差が出ていた。
- 初期の実装ではフロントが `reservables` を取得するエンドポイントを誤ってルート (`/`) に投げていたり、バックエンドのカラム名（`reservable_id` vs `use_id` 等）がコードと一致していない箇所があった。

修正目的
- UI とデータの整合性を回復し、同様の不整合で表示が欠けないようにする。
- バックエンド→フロントのデータ契約（JSON のフィールド名と型）を明確にし、フロントでの比較ミス（文字列／数値の差）を防ぐ。

作業内容（実施した変更）
- フロント側
  - frontend/src/api/reservationApi.ts: `fetchReservables()` が正しいエンドポイント `/reservables` を叩くよう修正。
  - frontend/src/hooks/useReservations.ts: フェッチ直後と再取得時に `id` / `reservableId` を Number に正規化し、`normalizeReservation()` を導入。API生データのログ出力を追加。
  - frontend/src/components/ReservationList.tsx: `useMemo` で `reservable` の lookup Map を作成し、文字列化でキーの差を吸収。早期 return を廃止して `ReservationCard` に undefined を渡し、カード側でフォールバック表示できるようにした。
  - frontend/src/components/ReservationCard.tsx: `reservable` を optional にして `reservable?.name ?? "未設定"` のフォールバック表示に変更。

- バックエンド側
  - backend/src/repositories/reservationRepositories.ts: SQL の参照カラム名を DB 側の `reservable_id` に合わせて修正（INSERT/SELECT）、`findAll()` と `update()` の戻り値で `id` / `reservableId` を明示的に Number にキャストするよう変更。`findAll()` に try/catch を入れて raw rows のログを出力するようにした（デバッグ用）。

変更ファイル（主要）
- frontend/src/api/reservationApi.ts
- frontend/src/hooks/useReservations.ts
- frontend/src/components/ReservationList.tsx
- frontend/src/components/ReservationCard.tsx
- backend/src/repositories/reservationRepositories.ts

コンソール出力（抜粋・要旨）
- 初期: フロントのログに `raw reservables` に複数の備品/会議室が存在する一方で、`raw reservations` が空配列や期待外の形で来るケースがあった。
- 正規化導入前: `normalizeReservation` のログで `raw: undefined, asNumber: NaN` が出力され、`ReservationList` のマッチ結果が `-> undefined` になる行が多数あった。
- バックエンド修正後: `reservationRepository.findAll rows:` のログに DB の rows が出力され、`normalizeReservation` のログでは `raw: 47, asNumber: 47, type: number` など数値に正しく変換されることを確認。
- 最終的に `ReservationList` のログで `reservation.id, reservation.reservableId, '->', target?.id` が対応付くケースが増え（例: `4 47 '->' 47`）、該当カードの `reservable.name` が正しく表示されるレコード数が増加した。

修正結果（現状）
- 重大な原因は DB 上の「参照先が存在しない予約（孤立レコード）」であったため、修正は以下の 2 層で行った:
  1) バックエンドでカラム名と型を正しく扱うよう修正→ フロントに正しいデータが戻るようにした。
  2) フロントで受け取り時に型を正規化、lookup を強化→ 一時的な不一致に耐性を持たせた。
- 結果: 多くのケースで `reservable` が正しくマッチし表示が復元。依然として DB に孤立レコードが残っている場合、それらは UI 上で `未設定` として表示される（安全なフォールバック）。

残る問題点 / 推奨対応
- 根本対応: DB に残る孤立レコード（reservations.reservable_id が reservables に存在しない行）を削除または正しい値に更新する。SQL 例:
  - 孤立行確認:
    ```sql
    SELECT r.* FROM reservations r
    LEFT JOIN reservables v ON r.reservable_id = v.id
    WHERE v.id IS NULL;
    ```
  - 削除（慎重に確認のうえ）:
    ```sql
    DELETE FROM reservations
    WHERE id IN (
      SELECT r.id FROM reservations r
      LEFT JOIN reservables v ON r.reservable_id = v.id
      WHERE v.id IS NULL
    );
    ```
  - あるいは正しい `reservable_id` に更新する（判断が必要）。
- 再発防止: `reservations.reservable_id` に外部キー制約を付与して参照整合性を強制する（マイグレーションで適用）。

作業範囲（ファイル変更の要約）
- backend/src/repositories/reservationRepositories.ts
  - `INSERT` のカラムを `reservable_id` に変更
  - `findAll()` / `update()` で `reservable_id` を参照して Number に正規化
  - DB raw rows のログ出力を追加
- frontend/src/hooks/useReservations.ts
  - fetch 後に `id` / `reservableId` を正規化する `normalizeReservation()` を導入
  - API 生データのログを追加
- frontend/src/components/ReservationList.tsx
  - `useMemo` で lookup Map を作成、文字列化でキーの差を吸収
  - 早期 return をやめ、カードに undefined を渡すことでフォールバック表示を可能に
- frontend/src/components/ReservationCard.tsx
  - `reservable` を optional にし `reservable?.name ?? "未設定"` で安全に表示
- frontend/src/api/reservationApi.ts
  - `fetchReservables()` が正しい `/reservables` エンドポイントを叩くよう修正

コンソール出力（参考・抜粋）
- raw reservables: Array(4) [ {id:4, name: 'プロジェクター', type:'EQUIPMENT'}, {id:47, name:'GGG', type:'ROOM'}, ... ]
- raw reservations: Array(3) [ ... ] または Array(0) が観測された（ケース依存）
- normalizeReservation: { raw: undefined, asNumber: NaN, type: 'undefined', original: {...} } ← 初期の問題例
- normalizeReservation: { raw: 47, asNumber: 47, type: 'number', original: {...} } ← 修正後の良好例

最終結果（まとめ）
- フロントでの表示欠落の主因は「DB の参照不整合（孤立レコード）」でした。バックエンドとフロント双方の修正により、多くの予約で `reservable` が正しくマッチし、UI 表示は回復しました。
- 今回の作業で得られたもの:
  - データフロー（DB→API→フロント）の確認と整合性改善
  - フロント側での堅牢性（型正規化・lookup 安定化）
  - バックエンドでの明示的な型キャストとログ出力

今後の推奨（優先度順）
1. 本番データベースの孤立レコードの確認と対応（削除または正しい id への更新）
2. 外部キー制約を追加して参照整合性を強制する（マイグレーション）
3. テストデータと本番データを分離し、テスト時はダミーデータをリセットする運用の徹底
4. ログに基づく監視を設定し、API が期待するスキーマから外れたレスポンスを早期検出する

補足
- 希望があれば、孤立レコードを削除するための SQL スクリプト（`prune_orphan_reservations.sql`）を作成してワークスペースに追加できます。

---
（このレポートはワークスペース内の変更を基に自動生成しました。追加でログを添付する場合は、ブラウザの DevTools コンソール出力をそのまま貼ってください。）
