@echo off
echo Building and starting docker compose services...

docker compose build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    exit /b 1
)

docker compose up -d

echo Services started!

echo Showing logs for nodejs-server service (Press Ctrl+C to stop)...
docker compose logs -f nodejs-server