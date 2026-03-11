# MongoDB Installation Script for Windows
Write-Host "MongoDB Installation Helper" -ForegroundColor Cyan
Write-Host "============================`n" -ForegroundColor Cyan

Write-Host "Checking if MongoDB is already installed..." -ForegroundColor Yellow

# Check if MongoDB is installed
$mongoInstalled = Get-Command mongod -ErrorAction SilentlyContinue

if ($mongoInstalled) {
    Write-Host "✅ MongoDB is already installed!" -ForegroundColor Green
    Write-Host "Version: " -NoNewline
    mongod --version | Select-String "db version"
    
    Write-Host "`nChecking if MongoDB service is running..." -ForegroundColor Yellow
    $mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    
    if ($mongoService) {
        if ($mongoService.Status -eq "Running") {
            Write-Host "✅ MongoDB service is running!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  MongoDB service is not running. Starting it..." -ForegroundColor Yellow
            Start-Service -Name "MongoDB"
            Write-Host "✅ MongoDB service started!" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️  MongoDB service not found. You may need to start MongoDB manually." -ForegroundColor Yellow
    }
    
    Write-Host "`n✅ MongoDB is ready to use!" -ForegroundColor Green
    Write-Host "You can now run: npm run server" -ForegroundColor Cyan
    exit 0
}

Write-Host "❌ MongoDB is not installed.`n" -ForegroundColor Red

Write-Host "You have two options:`n" -ForegroundColor Yellow

Write-Host "Option 1: MongoDB Atlas (Cloud - Recommended)" -ForegroundColor Cyan
Write-Host "  ✅ No installation needed" -ForegroundColor Green
Write-Host "  ✅ Free tier available" -ForegroundColor Green
Write-Host "  ✅ Automatic backups" -ForegroundColor Green
Write-Host "  ✅ Works from anywhere" -ForegroundColor Green
Write-Host "  📖 See MONGODB_SETUP.md for instructions`n" -ForegroundColor White

Write-Host "Option 2: Install MongoDB Locally" -ForegroundColor Cyan
Write-Host "  ✅ Full control" -ForegroundColor Green
Write-Host "  ✅ Works offline" -ForegroundColor Green
Write-Host "  ✅ Unlimited storage" -ForegroundColor Green
Write-Host ""

$choice = Read-Host "Would you like to download MongoDB installer? (y/n)"

if ($choice -eq "y" -or $choice -eq "Y") {
    Write-Host "`nOpening MongoDB download page..." -ForegroundColor Yellow
    Start-Process "https://www.mongodb.com/try/download/community"
    
    Write-Host "`nInstructions:" -ForegroundColor Cyan
    Write-Host "1. Download the Windows MSI installer" -ForegroundColor White
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. Choose 'Complete' installation" -ForegroundColor White
    Write-Host "4. Install as a Windows Service (recommended)" -ForegroundColor White
    Write-Host "5. After installation, run this script again to verify" -ForegroundColor White
    Write-Host "`nOr see MONGODB_SETUP.md for detailed instructions" -ForegroundColor Yellow
} else {
    Write-Host "`nNo problem! You can use MongoDB Atlas instead (no installation needed)" -ForegroundColor Yellow
    Write-Host "See MONGODB_SETUP.md for MongoDB Atlas setup instructions" -ForegroundColor Cyan
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
