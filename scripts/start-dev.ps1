$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$backend = Start-Process -FilePath "$root\.venv\Scripts\python.exe" -ArgumentList "src/python/flask_app.py" -WorkingDirectory $root -PassThru -WindowStyle Hidden
$frontend = Start-Process -FilePath "npm" -ArgumentList "run dev -- --host 0.0.0.0 --port 5173" -WorkingDirectory $root -PassThru -WindowStyle Hidden

Write-Host "Backend PID: $($backend.Id)"
Write-Host "Frontend PID: $($frontend.Id)"
Write-Host "Open http://127.0.0.1:5173/"
