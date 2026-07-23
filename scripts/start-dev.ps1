$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$env:FLASK_RUN_HOST = "0.0.0.0"
$env:FLASK_RUN_PORT = "5000"

$pythonPath = "$root\.venv\Scripts\python.exe"
$pythonArgs = @("src/python/flask_app.py")

if (-not (Test-Path $pythonPath)) {
    $pythonPath = "python"
}

if (Get-Command py -ErrorAction SilentlyContinue) {
    try {
        $pyOutput = (& py -0p 2>$null | Out-String)
        if ($pyOutput -match "3\.10") {
            $pythonPath = "py"
            $pythonArgs = @("-3.10", "src/python/flask_app.py")
        }
    } catch {
        # Fall back to the default Python interpreter.
    }
}

$backend = Start-Process -FilePath $pythonPath -ArgumentList $pythonArgs -WorkingDirectory $root -PassThru -WindowStyle Hidden
$frontend = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev -- --host 0.0.0.0 --port 5173" -WorkingDirectory $root -PassThru -WindowStyle Hidden

Write-Host "Backend PID: $($backend.Id)"
Write-Host "Frontend PID: $($frontend.Id)"
Write-Host "Open http://127.0.0.1:5173/"
