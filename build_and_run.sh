#!/bin/bash

echo "Building and starting docker compose services..."

docker compose build

if [ $? -ne 0 ]; then
  echo "Build failed!"
  exit 1
fi

docker compose up -d

echo "Services started!"

echo "Showing logs for nodejs-server service (Press Ctrl+C to stop)..."

docker compose logs -f nodejs-server
