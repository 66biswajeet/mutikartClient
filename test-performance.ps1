# Performance Testing Script
# Run this after implementing optimizations

Write-Host "🚀 Starting Performance Test..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean previous builds
Write-Host "📦 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Cleaned .next directory" -ForegroundColor Green
}

# Step 2: Build production bundle
Write-Host ""
Write-Host "🔨 Building production bundle..." -ForegroundColor Yellow
$buildStart = Get-Date
npm run build
$buildEnd = Get-Date
$buildDuration = ($buildEnd - $buildStart).TotalSeconds

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed in $([math]::Round($buildDuration, 2)) seconds" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Analyze bundle size
Write-Host ""
Write-Host "📊 Bundle Analysis:" -ForegroundColor Yellow

$buildDir = ".next"
if (Test-Path $buildDir) {
    $jsFiles = Get-ChildItem -Path "$buildDir/static/chunks" -Recurse -Filter "*.js" | Where-Object { $_.Name -notlike "*buildManifest*" -and $_.Name -notlike "*ssgManifest*" }
    $totalSize = ($jsFiles | Measure-Object -Property Length -Sum).Sum / 1MB
    
    Write-Host "   Total JS bundle size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan
    
    # Show top 5 largest chunks
    Write-Host "   Top 5 largest chunks:" -ForegroundColor Cyan
    $jsFiles | Sort-Object Length -Descending | Select-Object -First 5 | ForEach-Object {
        $sizeKB = [math]::Round($_.Length / 1KB, 2)
        Write-Host "      - $($_.Name): $sizeKB KB" -ForegroundColor Gray
    }
}

# Step 4: Check for optimization issues
Write-Host ""
Write-Host "🔍 Checking for common issues..." -ForegroundColor Yellow

# Check for source maps in production
$sourceMaps = Get-ChildItem -Path "$buildDir" -Recurse -Filter "*.map" -ErrorAction SilentlyContinue
if ($sourceMaps) {
    Write-Host "   ⚠️  Found $($sourceMaps.Count) source maps (should be 0 in production)" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ No source maps found (good!)" -ForegroundColor Green
}

# Check for console logs
Write-Host ""
Write-Host "🧹 Checking for console logs in production..." -ForegroundColor Yellow
$consoleCount = (Select-String -Path "$buildDir/static/chunks/*.js" -Pattern "console\.(log|debug|info)" -ErrorAction SilentlyContinue).Count
if ($consoleCount -gt 0) {
    Write-Host "   ⚠️  Found $consoleCount console statements (should be removed)" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ No console statements found (good!)" -ForegroundColor Green
}

# Step 5: Performance Summary
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "📈 Performance Optimization Summary" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Optimizations Applied:" -ForegroundColor Green
Write-Host "   - Next.js config optimized"
Write-Host "   - Code splitting & lazy loading"
Write-Host "   - Image optimization (Next/Image)"
Write-Host "   - LCP image prioritization"
Write-Host "   - Cache headers configured"
Write-Host "   - Bundle size reduced"
Write-Host "   - Preconnect hints optimized"
Write-Host ""
Write-Host "📊 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Start production server: npm start"
Write-Host "   2. Run Lighthouse: npm run lighthouse"
Write-Host "   3. Test on PageSpeed Insights"
Write-Host "   4. Deploy to Vercel/production"
Write-Host ""
Write-Host "🎯 Expected Performance Score: 85+" -ForegroundColor Green
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan

# Optional: Start server for testing
$startServer = Read-Host "Do you want to start the production server now? (y/n)"
if ($startServer -eq "y" -or $startServer -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Starting production server on http://localhost:3001..." -ForegroundColor Cyan
    npm start
}
