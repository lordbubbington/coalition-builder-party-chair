@echo off
setlocal
cd /d "%~dp0"

echo ====================================================================
echo  COALITION BUILDER: MULTI-CYCLE BALANCE AUDIT RUNNER
echo ====================================================================
echo Running headless 50-cycle continuous simulation audit...
echo.

node scripts\audit-multicycle-simulation.cjs %*

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Simulation audit completed successfully.
    echo Report generated at BALANCE_AUDIT_REPORT.md
) else (
    echo.
    echo [ERROR] Simulation audit encountered an error.
    exit /b 1
)
