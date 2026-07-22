$ErrorActionPreference = "Stop"

Get-CimInstance Win32_Process | Where-Object { $_.Name -in @('python.exe','node.exe','cmd.exe') -and $_.CommandLine -match 'flask_app.py|vite|5173' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Write-Host "Stopped local dev services."
