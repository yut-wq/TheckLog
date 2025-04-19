#!/bin/bash

# データベースが起動するのを待つ
echo "Waiting for database to be ready..."
sleep 5

# マイグレーションを実行
echo "Running database migrations..."
alembic upgrade head

# アプリケーションを起動
echo "Starting application..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload