$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
try {
    
    $projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $objDir = Join-Path $projectDir 'obj'
    $distDir = Join-Path $projectDir 'dist\release'
    $distRootDir = Join-Path $projectDir 'dist'
    $archivePath = Join-Path $objDir 'game.zip'
    $exePath = Join-Path $distDir 'Coalition Builder - Party Chair.exe'
    $temporaryExePath = Join-Path $distDir 'Coalition Builder - Party Chair.build.exe'
    $cscPath = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
    if (-not (Test-Path -LiteralPath $cscPath)) {
        $cscPath = Join-Path $env:WINDIR 'Microsoft.NET\Framework\v4.0.30319\csc.exe'
    }
    
    New-Item -ItemType Directory -Force -Path $objDir, $distDir, $distRootDir | Out-Null
    if (Test-Path -LiteralPath $archivePath) { Remove-Item -LiteralPath $archivePath -Force }
    if (Test-Path -LiteralPath $temporaryExePath) { Remove-Item -LiteralPath $temporaryExePath -Force }
    
    $packageItems = @(
        (Join-Path $projectDir 'index.html'),
        (Join-Path $projectDir 'styles.css'),
        (Join-Path $projectDir 'data.js'),
        (Join-Path $projectDir 'factions-0.15.js'),
        (Join-Path $projectDir 'scenario-2028.js'),
        (Join-Path $projectDir 'issues-0.2.1.js'),
        (Join-Path $projectDir 'maps-0.3.js'),
        (Join-Path $projectDir 'state-house-data-0.5.js'),
        (Join-Path $projectDir 'voter-model-0.5.js'),
        (Join-Path $projectDir 'demographics-0.9.js'),
        (Join-Path $projectDir 'political-trends-system.js'),
        (Join-Path $projectDir 'political-texture-system.js'),
        (Join-Path $projectDir 'v07-scaffolding.js'),
        (Join-Path $projectDir 'party-systems-data.js'),
        (Join-Path $projectDir 'party-systems-coalition.js'),
        (Join-Path $projectDir 'party-systems-robots.js'),
        (Join-Path $projectDir 'party-systems-engine.js'),
        (Join-Path $projectDir 'party-systems-ui.js'),
        (Join-Path $projectDir 'ballot-access.js'),
        (Join-Path $projectDir 'election-uncertainty.js'),
        (Join-Path $projectDir 'candidate-vetting.js'),
        (Join-Path $projectDir 'election-drift.js'),
        (Join-Path $projectDir 'election-night-engine.js'),
        (Join-Path $projectDir 'campaign-overhaul.js'),
        (Join-Path $projectDir 'faction-era-stability.js'),
        (Join-Path $projectDir 'engine.js'),
        (Join-Path $projectDir 'app.js'),
        (Join-Path $projectDir 'assets')
    )
    Compress-Archive -Path $packageItems -DestinationPath $archivePath -CompressionLevel Optimal
    
    & $cscPath /nologo /target:winexe /optimize+ `
        "/out:${temporaryExePath}" `
        "/resource:${archivePath},CoalitionBuilder.Payload" `
        /reference:System.IO.Compression.dll `
        /reference:System.IO.Compression.FileSystem.dll `
        (Join-Path $projectDir 'launcher.cs')
    
    if ($LASTEXITCODE -ne 0) { throw "Executable build failed with exit code $LASTEXITCODE." }
    if (Test-Path -LiteralPath $exePath) {
        [System.IO.File]::Copy($temporaryExePath, $exePath, $true)
        Remove-Item -LiteralPath $temporaryExePath -Force
    } else {
        Move-Item -LiteralPath $temporaryExePath -Destination $exePath
    }
    Remove-Item -LiteralPath $archivePath -Force
    $rootExePath = Join-Path $distRootDir 'Coalition Builder - Party Chair.exe'
    try {
        [System.IO.File]::Copy($exePath, $rootExePath, $true)
        Get-Item -LiteralPath $exePath, $rootExePath | Select-Object FullName, Length, LastWriteTime
    } catch [System.IO.IOException] {
        Write-Warning "The release executable was built, but the dist copy could not be refreshed. Close any running game window and run build.ps1 again. Release build: $exePath"
        Get-Item -LiteralPath $exePath | Select-Object FullName, Length, LastWriteTime
    }
} catch {
    Write-Host ''
    Write-Host '================ BUILD ERROR ================' -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host $_.InvocationInfo.PositionMessage -ForegroundColor Yellow
    Write-Host '=============================================' -ForegroundColor Red
    exit 1
}
