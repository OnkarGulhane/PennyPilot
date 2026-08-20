# test_api.ps1 — End-to-End REST API Verification Script for SmartExpense

$baseUrl = "http://localhost:8080/api"

Write-Host "1. Testing Login API..." -ForegroundColor Cyan
$loginBody = @{
    email = "omkar@example.com"
    password = "SecurePassword123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
Write-Host "Login Success! User ID:" $loginResponse.user.id "Email:" $loginResponse.user.email "Token Type:" $loginResponse.tokenType

$token = $loginResponse.token
$headers = @{ "Authorization" = "Bearer $token" }

Write-Host "`n2. Testing Create Expense (Bills)..." -ForegroundColor Cyan
$expBody = @{
    amount = 1800.00
    category = "BILLS"
    description = "Electricity Bill"
    expenseDate = "2026-08-20"
    paymentMethod = "BANK_TRANSFER"
} | ConvertTo-Json

$expResponse = Invoke-RestMethod -Uri "$baseUrl/expenses" -Method Post -Body $expBody -Headers $headers -ContentType "application/json"
Write-Host "Expense Created! ID:" $expResponse.id "Category:" $expResponse.category "Amount: ₹" $expResponse.amount

Write-Host "`n3. Testing Get Expenses List (Paginated, Sorted)..." -ForegroundColor Cyan
$expensesList = Invoke-RestMethod -Uri "$baseUrl/expenses?page=0&size=5&sort=amount,desc" -Method Get -Headers $headers
Write-Host "Fetched Total Expenses Elements:" $expensesList.totalElements "Page Size:" $expensesList.size

Write-Host "`n4. Testing Dashboard Summary API..." -ForegroundColor Cyan
$dashResponse = Invoke-RestMethod -Uri "$baseUrl/dashboard/summary" -Method Get -Headers $headers
$dashResponse | Format-List

Write-Host "`n5. Testing Category Breakdown API..." -ForegroundColor Cyan
$catResponse = Invoke-RestMethod -Uri "$baseUrl/dashboard/category-summary" -Method Get -Headers $headers
$catResponse | Format-Table

Write-Host "`n6. Testing Monthly Trend API..." -ForegroundColor Cyan
$monthlyResponse = Invoke-RestMethod -Uri "$baseUrl/dashboard/monthly-summary" -Method Get -Headers $headers
$monthlyResponse | Format-Table

Write-Host "`n7. Testing Swagger OpenAPI Spec (http://localhost:8080/api-docs)..." -ForegroundColor Cyan
$swaggerDocs = Invoke-RestMethod -Uri "http://localhost:8080/api-docs" -Method Get
Write-Host "Swagger OpenAPI Title:" $swaggerDocs.info.title "Version:" $swaggerDocs.info.version "Endpoints Count:" $swaggerDocs.paths.PSObject.Properties.Count
