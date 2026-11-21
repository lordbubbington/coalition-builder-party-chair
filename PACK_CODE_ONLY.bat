@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo PACKAGING CODE-ONLY ARCHIVE: code-handoff.zip
echo ===================================================

if exist "code-handoff.zip" del /f /q "code-handoff.zip"

where tar.exe >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Windows tar.exe to package code-handoff.zip...
    tar.exe -a -c -f code-handoff.zip *.js *.html *.css *.json *.md BUILD_EXE.bat build.ps1 scripts
) else (
    echo Using PowerShell to package code-handoff.zip...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$f = @(Get-ChildItem -File | Where-Object { $_.Name -match '\.(js|html|css|json|md)$|^BUILD_EXE\.bat$|^build\.ps1$' }) + @(Get-Item 'scripts'); Compress-Archive -Path $f.FullName -DestinationPath 'code-handoff.zip' -Force"
)

if exist "code-handoff.zip" (
    echo.
    echo [SUCCESS] code-handoff.zip created successfully!
    exit /b 0
) else (
    echo.
    echo [ERROR] Failed to create code-handoff.zip.
    exit /b 1
)
