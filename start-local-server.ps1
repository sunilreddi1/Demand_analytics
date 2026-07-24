# PowerShell script to start permanent local server
Push-Location $PSScriptRoot
Write-Host "Starting permanent local server on http://localhost:8000" -ForegroundColor Green
Write-Host "Keep this window open to maintain the server" -ForegroundColor Yellow
http-server dist -p 8000 -c-1 --gzip
