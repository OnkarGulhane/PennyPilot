# PennyPilot All-in-One Launcher Script
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "       PennyPilot Project Launcher               " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Check & Free ports if needed
$scriptPath = Join-Path $PSScriptRoot "check-ports.ps1"
if (Test-Path $scriptPath) {
    & powershell -ExecutionPolicy Bypass -File $scriptPath
}

Write-Host "`nLaunching Backend and Frontend in separate windows..." -ForegroundColor Yellow

# 2. Launch Backend
$backendCmd = "Set-Location '$PSScriptRoot\backend'; Write-Host '--- Starting Spring Boot Backend (Port 8080) ---' -ForegroundColor Cyan; .\mvnw.cmd spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# 3. Launch Frontend
$frontendCmd = "Set-Location '$PSScriptRoot\frontend'; Write-Host '--- Starting Vite Frontend (Port 5173) ---' -ForegroundColor Green; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "`n[SUCCESS] Both Backend and Frontend windows have been opened!" -ForegroundColor Green
Write-Host "  Backend URL:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "  Frontend URL: http://localhost:5173" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
