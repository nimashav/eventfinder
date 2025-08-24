# PowerShell script to test registration
$uri = "http://localhost:5002/api/auth/register"
$testUser = @{
    firstName = "Test"
    lastName = "User"
    email = "test$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    password = "TestPass123"
    confirmPassword = "TestPass123"
    phone = "1234567890"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    Write-Host "Testing registration endpoint..." -ForegroundColor Cyan
    Write-Host "Sending registration request..." -ForegroundColor Yellow
    Write-Host "Request data: $testUser" -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $testUser -Headers $headers
    
    Write-Host "Registration successful!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Green
}
catch {
    Write-Host "Registration failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseText = $reader.ReadToEnd()
        Write-Host "Response: $responseText" -ForegroundColor Red
    }
}
