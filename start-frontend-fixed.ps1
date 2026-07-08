$scriptDir = $PSScriptRoot
$projectRoot = $scriptDir
$frontendDir = Join-Path $projectRoot 'frontend'

Write-Host "Starting frontend from: $frontendDir"
Set-Location -Path $frontendDir
npm --prefix "$frontendDir" run dev -- --host 127.0.0.1 --port 5173
