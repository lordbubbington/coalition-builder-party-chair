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
        (Join-Path $projectDir 'demographic-migration-data.js'),
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
        (Join-Path $projectDir 'media-shocks-system.js'),
        (Join-Path $projectDir 'campaign-overhaul.js'),
        # [v0.18.5 CAMPAIGN-EVENTS]
        (Join-Path $projectDir 'campaign-events-system.js'),
        (Join-Path $projectDir 'redistricting-ballot-system.js'),
        (Join-Path $projectDir 'coalition-politics-system.js'),
        (Join-Path $projectDir 'atlas-multiplayer-system.js'),
        (Join-Path $projectDir 'leading-faction-system.js'),
        (Join-Path $projectDir 'faction-era-stability.js'),
        (Join-Path $projectDir 'v0185-playtest-fixes.js'),
        # [v0.18.5 SAVE-MIGRATIONS]
        (Join-Path $projectDir 'save-migrations.js'),
        # [v0.18.5 CORE-MODULARIZATION]
        (Join-Path $projectDir 'persistence-core.js'),
        (Join-Path $projectDir 'custom-party-core.js'),
        (Join-Path $projectDir 'faction-core.js'),
        (Join-Path $projectDir 'ui-setup-views.js'),
        # [OFF-CYCLE]
        (Join-Path $projectDir 'off-cycle-interlude.js'),
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
    $releaseUpdated = $false
    try {
        [System.IO.File]::Copy($temporaryExePath, $exePath, $true)
        $releaseUpdated = $true
    } catch [System.IO.IOException] {
        Write-Warning "The release executable ($exePath) is locked by an open process and could not be overwritten. Close any running game window to refresh this copy."
    }

    $rootExePath = Join-Path $distRootDir 'Coalition Builder - Party Chair.exe'
    $rootUpdated = $false
    try {
        [System.IO.File]::Copy($temporaryExePath, $rootExePath, $true)
        $rootUpdated = $true
    } catch [System.IO.IOException] {
        Write-Warning "The dist root executable ($rootExePath) is locked by an open process and could not be overwritten. Close any running game window to refresh this copy."
    }

    Remove-Item -LiteralPath $temporaryExePath -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $archivePath -Force -ErrorAction SilentlyContinue

    if ($releaseUpdated -or $rootUpdated) {
        Write-Host "Executable build packaging complete!" -ForegroundColor Green
        if ($releaseUpdated) { Get-Item -LiteralPath $exePath | Select-Object FullName, Length, LastWriteTime }
        if ($rootUpdated) { Get-Item -LiteralPath $rootExePath | Select-Object FullName, Length, LastWriteTime }
    } else {
        throw "Neither the release nor root executable could be refreshed because both are locked by open processes. Please close any running Coalition Builder window."
    }
} catch {
    Write-Host ''
    Write-Host '================ BUILD ERROR ================' -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host $_.InvocationInfo.PositionMessage -ForegroundColor Yellow
    Write-Host '=============================================' -ForegroundColor Red
    exit 1
}
