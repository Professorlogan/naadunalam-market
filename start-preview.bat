@echo off
title Naadu Nalam Market preview (localhost:3100)
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install the LTS version from https://nodejs.org and run this file again.
  pause
  exit /b 1
)
echo Checking packages...
call npm install --no-audit --no-fund
if errorlevel 1 goto failed
start "" /min cmd /c "timeout /t 12 >nul & start http://localhost:3100"
echo.
echo  Starting the site at http://localhost:3100  - keep this window open.
echo  Changes Claude copies in appear automatically after a moment.
echo.
call npm run dev -- -p 3100
:failed
echo.
echo  The preview stopped. If there is an error above, copy it and send it to Claude.
pause
