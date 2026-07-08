$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root 'backend'
$frontendDir = Join-Path $root 'frontend'

Write-Host "Launching backend in: $backendDir"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$backendDir'; python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000"

Write-Host "Launching frontend in: $frontendDir"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$frontendDir'; npm run dev -- --host 127.0.0.1 --port 5173"

Write-Host "Started backend and frontend in separate windows."
Write-Host "Backend: http://127.0.0.1:8000/api/v1/health"
Write-Host "Frontend: http://127.0.0.1:5173"