# 美容室 空き状況閲覧・予約管理アプリ (Grazioso様)

サロンの予約空き状況をリアルタイムに可視化し、オーナーの予約管理業務を効率化するWebアプリケーション

---

### [grazioso-wheat.vercel.app](https://grazioso-wheat.vercel.app/)
👆 実際のプロダクトはこちらです
　 運用は来週以降からを予定しています

---

## 📄 概要
個人経営のヘアサロン向けに開発した予約管理システムです。  
一般のお客さまはアプリ上で最新の「空き枠状況」をリアルタイムに確認でき、サロンオーナーは認証付きの専用ダッシュボードから日々の予約枠の登録・編集・ステータス管理を直感的に行えます。

## 📦 主な機能 (Features)

### 一般顧客向け
- **空き状況カレンダー閲覧**：日付ごとの空き枠・予約状況をリアルタイムで確認可能。
- **問い合わせ導線**：空き枠を確認したうえで、公式LINEや電話へのスムーズな予約連絡を促すUI設計。

### オーナー向け（要ログイン）
- **Supabase Authによる認証・ルートガード**：管理者専用ページ（`/dashboard`、`/settings`）への不正アクセスを保護。
- **予約登録・編集・削除機能**：日時、顧客名、対応メニューなどのステータス管理（予約中・キャンセル等）。
- **予約対象（リソース）管理**：顧客情報(氏名・性別等)の登録・管理。
- **入力バリデーション**：開始・終了日時の整合性チェックや重複予約の防止。

## 🛠️ 技術スタック (Tech Stack)

- **Language**: TypeScript
- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database / Auth**: PostgreSQL, Supabase (Supabase Auth)
- **Infrastructure / Deploy**: Vercel (Frontend), GCP Cloud Run (Backend)

## 🏗️ 設計思想・アーキテクチャ (Architecture)

保守性・テスタビリティ・拡張性を考慮し、
バックエンドには **MVCS (Model-View-Controller-Service) アーキテクチャ** を採用、
フロントエンドは **Custom Hooks による関心の分離** を徹底しています。

---

### こだわったポイント

- **UIとロジックの分離 (Frontend)**
  Reactコンポーネント（View）からデータフェッチや認証ロジックを Custom Hooks（`useAuth` など）として切り出し、Viewコンポーネントの肥大化と密結合を防止。
- **堅牢な認証フローとライフサイクル管理**
  Supabase Auth のセッション状態を監視する `ProtectedRoute` を構築。コンポーネントのアンマウント時にリスナー（`subscription`）を確実にクリーンアップし、メモリリークを防止。
- **レンダリング最適化と状態同期**
  モーダルの初期値同期において、不要な `useEffect` での `setState` を排除。Reactの `key` 属性による再マウント設計を採用し、レンダリングカスケードの抑制とクリーンな状態管理を実現。
- **責任の分離 (Backend)**
  1. **Controller**：リクエストのバリデーションとレスポンス/エラーハンドリングを担当
  2. **Service**：予約重複判定などのビジネスロジックを集約
  3. **Repository**：PostgreSQL/SupabaseへのCRUDデータアクセスを担当

## 💾 データベース設計 (Database Schema)

PostgreSQL (Supabase) 上で以下のリレーションを構築して運用しています。

- **customers** (予約対象枠・顧客マスタ)
  - `id` (PK): 一意な識別子
  - `name`: 顧客名
  - `sex`: 顧客性別
  - `is_active`: 有効フラグ

- **reservations** (予約データ)
  - `id` (PK): 予約ID
  - `customer_id` (FK): `customers.id` への外部キー
  - `start_time`: 施術開始日時
  - `end_time`: 施術終了日時
  - `user_id`:ログインユーザーID 
  - `status`: 予約ステータス（予約中 / キャンセル等）

- **関係性**: `customers` (1) : `reservations` (N)

## 💡 工夫した点・課題解決

- **モバイルファーストなUI/UX**
  サロンオーナーが現場でスマートフォンから素早く予約状況を把握・更新できるよう、ボトムナビゲーションや視認性の高いステータスバッジを導入。
- **BaaS (Supabase) を活用したセキュアな認証**
  外部への新規登録口を塞ぎ、管理者アカウントのみを安全に管理・運用するクローズドな認証基盤を構築。
- **環境差異の吸収とCI/CD**
  ローカル環境・Vercel・GCP Cloud Run 間での環境変数管理（`VITE_SUPABASE_*` 等）およびコンテナデプロイフローの整備。