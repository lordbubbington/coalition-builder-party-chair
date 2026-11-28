@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo  Building Coalition Builder: Party Chair (v0.19.3)...
echo ============================================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -LiteralPath '%~dp0' -Include *.ps1,*.cs,*.bat -ErrorAction SilentlyContinue | Unblock-File -ErrorAction SilentlyContinue"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0build.ps1"
set BUILD_RC=%ERRORLEVEL%
echo.
if not %BUILD_RC%==0 goto :failed
echo [SUCCESS] Build complete!
echo Executable created at: "%~dp0dist\Coalition Builder - Party Chair.exe"
echo.
pause
exit /b 0
:failed
echo [ERROR] Build failed with exit code %BUILD_RC%.
echo See the red error message above (or close any open game window and try again).
echo.
pause
exit /b %BUILD_RC%
