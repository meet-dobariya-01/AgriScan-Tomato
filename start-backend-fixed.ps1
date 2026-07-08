$scriptDir = $PSScriptRoot
$projectRoot = $scriptDir
$backendDir = Join-Path $projectRoot 'backend'

Write-Host "Starting backend from: $backendDir"
Set-Location -Path $backendDir
python -m uvicorn backend.main:app --app-dir "$projectRoot" --reload --host 127.0.0.1 --port 8000
