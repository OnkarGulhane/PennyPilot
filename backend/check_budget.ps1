$baseUrl = "http://localhost:8080/api"

$loginBody = @{
    email = "omkar@example.com"
    password = "SecurePassword123"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.token
$headers = @{ "Authorization" = "Bearer $token" }

Write-Host "=== GET /api/budgets ===" -ForegroundColor Cyan
$budgets = Invoke-RestMethod -Uri "$baseUrl/budgets" -Method Get -Headers $headers
$budgets | ConvertTo-Json

Write-Host "`n=== GET /api/dashboard/summary ===" -ForegroundColor Cyan
$summary = Invoke-RestMethod -Uri "$baseUrl/dashboard/summary" -Method Get -Headers $headers
$summary | ConvertTo-Json
