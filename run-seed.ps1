# PowerShell script to run the complaint seeding
Write-Host "🌱 Starting Complaint Data Seeding..." -ForegroundColor Green

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Run the seeding script
Write-Host "🚀 Generating seed data..." -ForegroundColor Yellow
node seed-complaints.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Seed data generated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Generated files:" -ForegroundColor Cyan
    Write-Host "  - seed-complaints.json (100 complaints in JSON format)" -ForegroundColor White
    Write-Host "  - seed-complaints.csv (100 complaints in CSV format)" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Data Details:" -ForegroundColor Cyan
    Write-Host "  - Region: North Addis Ababa Region" -ForegroundColor White
    Write-Host "  - Service Center: NAAR No.6" -ForegroundColor White
    Write-Host "  - Location: Yeka Sub City (Woreda 01, 02, 03)" -ForegroundColor White
    Write-Host "  - Date Range: Last 30 days with trend distribution" -ForegroundColor White
    Write-Host "  - Categories: All 21 complaint types included" -ForegroundColor White
    Write-Host "  - Priorities: Distributed based on complaint severity" -ForegroundColor White
    Write-Host "  - Status: Realistic progression based on complaint age" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Import seed-complaints.csv into your complaint management system" -ForegroundColor White
    Write-Host "  2. Or use seed-complaints.json for API-based import" -ForegroundColor White
    Write-Host "  3. The data includes realistic Ethiopian names, addresses, and phone numbers" -ForegroundColor White
    Write-Host "  4. Complaint dates are distributed across the last 30 days for trend analysis" -ForegroundColor White
} else {
    Write-Host "❌ Error generating seed data" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Seeding completed successfully!" -ForegroundColor Green