# Run backend and frontend together from the repository root
$backendPath = "D:\Users\Downloads\TIME_PASS\Tomato_Disease_Classification\backend"
$frontendPath = "D:\Users\Downloads\TIME_PASS\Tomato_Disease_Classification\frontend"

Write-Host "Starting backend..."
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$backendPath'; python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000"

Write-Host "Starting frontend..."
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$frontendPath'; npm run dev -- --host 127.0.0.1 --port 5173"

Write-Host "Both services launched in separate PowerShell windows. Backend: http://127.0.0.1:8000, Frontend: http://127.0.0.1:5173"