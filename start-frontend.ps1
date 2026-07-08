$scriptDir = $PSScriptRoot
$projectRoot = $scriptDir
$frontendDir = Join-Path $projectRoot 'frontend'

Write-Host "Starting frontend in $frontendDir"
Set-Location -Path $frontendDir
npm run dev -- --host 127.0.0.1 --port 5173