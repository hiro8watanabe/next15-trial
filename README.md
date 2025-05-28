# Next.js 15 Practice Project

Next.js 15 とモダンなフロントエンド技術を学習・試行するためのプロジェクトです。

## 🚀 技術スタック

### フロントエンド

- **Next.js 15.3.2** - React フレームワーク（App Router 使用）
- **React 19** - UI ライブラリ
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - ユーティリティファースト CSS フレームワーク

### バックエンド・データベース

- **Prisma** - ORM とデータベース管理
- **SQLite** - 開発環境用軽量データベース
- **Zod** - スキーマ検証ライブラリ

### 開発・テスト環境

- **Jest** - テストフレームワーク
- **Testing Library** - React コンポーネントテスト
- **ESLint** - コード品質管理
- **Prettier** - コードフォーマッター

## 📁 プロジェクト構造

```
next15-trial/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── contacts/        # 連絡先管理機能
│   │   ├── blog/           # ブログ機能
│   │   ├── rendering/      # レンダリング例
│   │   ├── rcc/           # React Client Component 例
│   │   ├── rsc/           # React Server Component 例
│   │   ├── api/           # API Routes
│   │   ├── (auth)/        # 認証関連ルート
│   │   └── _components/   # 共通コンポーネント
│   ├── components/        # 再利用可能コンポーネント
│   ├── lib/              # ユーティリティ・ヘルパー
│   ├── validations/      # バリデーションスキーマ
│   ├── generated/        # Prisma生成ファイル
│   └── middleware.ts     # Next.js ミドルウェア
├── prisma/
│   ├── schema.prisma     # データベーススキーマ
│   ├── migrations/       # マイグレーションファイル
│   └── dev.db           # SQLite データベース
└── public/              # 静的ファイル
```

## 🗄️ データベース

### Contact モデル

```prisma
model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🛠️ セットアップ

### 前提条件

- Node.js (推奨: v18 以上)
- npm / yarn / pnpm / bun

### インストール

1. リポジトリをクローン

```bash
git clone <repository-url>
cd next15-trial
```

2. 依存関係をインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

3. 環境変数を設定

```bash
cp .env.example .env
# .envファイルを編集（必要に応じて）
```

4. データベースを初期化

```bash
npx prisma generate
npx prisma db push
```

## 🚦 開発

### 開発サーバーを起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

### 主要なコマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# リンター実行
npm run lint

# テスト実行
npm run test

# テスト（ウォッチモード）
npm run test:watch
```

## 🧪 テスト

このプロジェクトでは Jest と Testing Library を使用したテスト環境が構築されています。

```bash
# 全テスト実行（カバレッジ付き）
npm run test

# ウォッチモードでテスト実行
npm run test:watch
```

### テスト設定

- **Jest**: テストフレームワーク
- **jsdom**: ブラウザ環境をエミュレート
- **Testing Library**: React コンポーネントのテスト
- **ts-jest**: TypeScript サポート

## 📚 学習・実験領域

### 実装済み機能

- **連絡先管理** (`/contacts`) - CRUD 操作の実装例
- **RSC/RCC 例** - Server Component と Client Component の違い
- **フォームバリデーション** - Zod を使用した型安全なバリデーション
- **データベース操作** - Prisma を使用したデータ管理

### 今後の実装予定

- 認証機能
- ブログ機能
- 様々なレンダリングパターンの実装
- パフォーマンス最適化の実例

## 🎯 学習目標

1. **Next.js 15 の新機能**

   - App Router の理解
   - Server Components と Client Components の使い分け
   - 新しいメタデータ API

2. **モダン React 開発**

   - React 19 の新機能
   - フックパターンの最適化
   - 状態管理

3. **フルスタック開発**

   - API Routes の活用
   - データベース設計と ORM
   - バリデーション

4. **品質向上**
   - テスト駆動開発
   - 型安全性の確保
   - パフォーマンス監視

## 📖 参考資料

- [Next.js Documentation](https://nextjs.org/docs) - Next.js の機能と API
- [Prisma Documentation](https://www.prisma.io/docs) - データベースと ORM
- [Tailwind CSS](https://tailwindcss.com/docs) - CSS フレームワーク
- [Testing Library](https://testing-library.com/) - テストのベストプラクティス

## 🔄 継続的改善

このプロジェクトは学習と実験を目的としており、継続的に新しい技術や手法を取り入れていく予定です。

- コードの品質向上
- パフォーマンスの最適化
- 新しい技術の導入
- テストカバレッジの拡充

---

**Note**: このプロジェクトは学習目的で作成されており、実際のプロダクション環境での使用は想定していません。
