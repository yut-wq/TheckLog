# TechLog API 仕様書

## 認証系

### 🔐 POST /api/auth/signup

- 説明: 新規ユーザー登録
- リクエスト:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

- レスポンス: 201 Created

```json
{
  "id": "uuid",
  "username": "string",
  "email": "string"
}
```

---

### 🔐 POST /api/auth/login

- 説明: ログインしてトークンを取得
- リクエスト:

```json
{
  "email": "string",
  "password": "string"
}
```

- レスポンス: 200 OK

```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

---

## ユーザー

### 👤 GET /api/users/me

- 説明: 自身のユーザー情報を取得
- 認証: 必須
- レスポンス:

```json
{
  "id": "uuid",
  "username": "string",
  "email": "string"
}
```

---

## 記事

### 📝 POST /api/articles

- 説明: 新しい記事を投稿
- 認証: 必須
- リクエスト:

```json
{
  "title": "string",
  "content": "string",
  "tags": ["tag1", "tag2"]
}
```

- レスポンス: 201 Created

```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "tags": ["tag1", "tag2"],
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

### 📄 GET /api/articles

- 説明: 全記事一覧を取得（ページング対応予定）
- レスポンス:

```json
[
  {
    "id": "uuid",
    "title": "string",
    "tags": ["tag1", "tag2"],
    "created_at": "timestamp"
  }
]
```

---

### 📄 GET /api/articles/{article_id}

- 説明: 特定の記事を取得
- レスポンス:

```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "tags": ["tag1", "tag2"],
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

### ✏️ PUT /api/articles/{article_id}

- 説明: 記事を更新（本人のみ）
- 認証: 必須
- リクエスト:

```json
{
  "title": "string",
  "content": "string",
  "tags": ["tag1", "tag2"]
}
```

- レスポンス: 200 OK（更新後の内容）

---

### ❌ DELETE /api/articles/{article_id}

- 説明: 記事を削除（本人のみ）
- 認証: 必須
- レスポンス: 204 No Content

---

## タグ

### 🔖 GET /api/tags

- 説明: タグ一覧取得
- レスポンス:

```json
[{ "id": "uuid", "name": "string" }]
```

---

## 補足

- 認証には JWT トークンを使用。
- `/api/` 以下に全てのエンドポイントを配置。
- バリデーションやエラーレスポンスの詳細は後述予定。
