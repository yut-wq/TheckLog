FROM python:3.11-slim

WORKDIR /app

# システムパッケージのインストール
RUN apt-get update && \
    apt-get install -y netcat-traditional && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure the script has the correct line endings and permissions
RUN chmod +x /app/start.sh && \
    sed -i 's/\r$//' /app/start.sh

CMD ["/bin/bash", "/app/start.sh"]