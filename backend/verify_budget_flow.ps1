$baseUrl = "http://localhost:8080/api"

$loginBody = @{
    email = "omkar@example.com"
    password = "SecurePassword123"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.token
$headers = @{ "Authorization" = "Bearer $token" }

Write-Host "1. Fetching current budgets..." -ForegroundColor Yellow
$budgets = Invoke-RestMethod -Uri "$baseUrl/budgets" -Method Get -Headers $headers
$budgets | ConvertTo-Json

if ($budgets -and $budgets.id) {
    $budgetId = $budgets.id
    Write-Host "`n2. Updating existing budget ID $budgetId to 25000.00..." -ForegroundColor Cyan
    $updateBody = @{
        month = 8
        year = 2026
        amount = 25000.00
    } | ConvertTo-Json
    $updated = Invoke-RestMethod -Uri "$baseUrl/budgets/$budgetId" -Method Put -Body $updateBody -ContentType "application/json" -Headers $headers
    Write-Host "Budget Updated Successfully!" -ForegroundColor Green
    $updated | ConvertTo-Json
}

Write-Host "`n3. Checking Updated Dashboard Summary..." -ForegroundColor Yellow
$summary = Invoke-RestMethod -Uri "$baseUrl/dashboard/summary" -Method Get -Headers $headers
$summary | ConvertTo-Json
