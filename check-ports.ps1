param (
    [switch]$FreePorts
)

# PennyPilot Port Checker & Helper Script
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "       PennyPilot Port Status Check              " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

function Find-FreePort($startPort) {
    $port = $startPort
    while ($true) {
        $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if (-not $conn) {
            return $port
        }
        $port++
    }
}

function Check-And-Handle-Port($port, $name) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        $pids = $conns.OwningProcess | Select-Object -Unique
        foreach ($pidToKill in $pids) {
            $proc = Get-Process -Id $pidToKill -ErrorAction SilentlyContinue
            $procName = if ($proc) { $proc.ProcessName } else { "Unknown" }
            
            if ($FreePorts) {
                Write-Host "[ACTION] Terminating process '$procName' (PID: $pidToKill) occupying port $port..." -ForegroundColor Yellow
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
                Write-Host "[SUCCESS] Port $port freed!" -ForegroundColor Green
            } else {
                Write-Host "[OCCUPIED] $name (Port $port) is currently in use by process '$procName' (PID: $pidToKill)" -ForegroundColor Yellow
            }
        }
        return $true
    } else {
        Write-Host "[FREE]     $name (Port $port) is FREE and ready!" -ForegroundColor Green
        return $false
    }
}

# 1. Database
$dbBusy = Check-And-Handle-Port 5432 "PostgreSQL Database"

# 2. Backend
$backendBusy = Check-And-Handle-Port 8080 "Spring Boot Backend"

# 3. Frontend
$frontendBusy = Check-And-Handle-Port 5173 "Vite Frontend"

Write-Host "`n-------------------------------------------------" -ForegroundColor Gray

if ($backendBusy -and -not $FreePorts) {
    $nextFreePort = Find-FreePort 8081
    Write-Host "Backend Port 8080 is BUSY!" -ForegroundColor Red
    Write-Host "Option A (Recommended): Run backend on fresh Port ${nextFreePort}:" -ForegroundColor Cyan
    Write-Host "  cd backend; .\mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=--server.port=$nextFreePort" -ForegroundColor White
    Write-Host "Option B: Free up Port 8080 automatically by running:" -ForegroundColor Cyan
    Write-Host "  powershell -ExecutionPolicy Bypass -File .\check-ports.ps1 -FreePorts" -ForegroundColor White
} elseif (-not $backendBusy) {
    Write-Host "Backend is ready to start on default port 8080." -ForegroundColor Green
}

if ($frontendBusy -and -not $FreePorts) {
    Write-Host "Frontend Port 5173 is BUSY!" -ForegroundColor Yellow
    Write-Host "Vite will automatically pick a fresh port (e.g. 5174) when started." -ForegroundColor Cyan
} elseif (-not $frontendBusy) {
    Write-Host "Frontend is ready to start on default port 5173." -ForegroundColor Green
}

Write-Host "=================================================" -ForegroundColor Cyan
