#!/bin/bash

# データベースが起動するのを待つ
echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
    echo "Waiting for database..."
    sleep 1
done
echo "Database is ready!"

# マイグレーションを実行
echo "Running database migrations..."
alembic upgrade head

# アプリケーションを起動
echo "Starting application..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload