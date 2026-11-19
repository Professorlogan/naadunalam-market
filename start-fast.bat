@echo off
title Naadu Nalam fast preview
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
echo Building the site once. This takes about a minute...
call npm run build
if errorlevel 1 goto failed
start "" /min cmd /c "timeout /t 4 >/dev/null & start http://localhost:3000"
echo.
echo  The site is running at http://localhost:3000  - keep this window open.
echo  Pages open instantly in this mode. After Claude copies new files, close this window and run this file again.
echo.
call npm run start
:failed
echo.
echo  The preview stopped. If there is an error above, copy it and send it to Claude.
pause
