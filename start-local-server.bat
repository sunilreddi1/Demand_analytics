@echo off
REM Start permanent local HTTP server
cd %~dp0
echo Starting permanent local server on http://localhost:8000
http-server dist -p 8000 -c-1 --gzip
pause
