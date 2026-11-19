@echo off
title Naadu Nalam preview
cd /d "%~dp0"
where node >/dev/null 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install the LTS version from https://nodejs.org and run this file again.
  pause
  exit /b 1
)
echo Checking packages...
call npm install --no-audit --no-fund
if errorlevel 1 goto failed
start "" /min cmd /c "timeout /t 10 >/dev/null & start http://localhost:3000"
echo.
echo  Starting the site at http://localhost:3000  - keep this window open.
echo.
call npm run dev
:failed
echo.
echo  The preview stopped. If there is an error above, copy it and send it to Claude.
pause
