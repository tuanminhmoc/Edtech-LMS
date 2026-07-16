@echo off
setlocal EnableExtensions
chcp 65001 >nul

title Cài đặt EdTech LMS Pro
set "APP_NAME=EdTech LMS Pro"
set "APP_URL=https://tuanminhmoc.github.io/#home"
set "APP_HOME=https://tuanminhmoc.github.io/"
set "APP_DIR=%LOCALAPPDATA%\EdTech LMS Pro"
set "ICON_FILE=%APP_DIR%\EdTech LMS Pro.ico"
set "ICON_URL=https://tuanminhmoc.github.io/assets/icons/EdTech-LMS-Pro.ico"

if not exist "%APP_DIR%" mkdir "%APP_DIR%" >nul 2>&1

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "try { Invoke-WebRequest -UseBasicParsing '%ICON_URL%' -OutFile '%ICON_FILE%' -ErrorAction Stop } catch { exit 0 }" >nul 2>&1

set "BROWSER="
set "PROFILE_ARG="

if exist "%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe" (
  set "BROWSER=%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe"
  set "PROFILE_ARG=--profile-directory=Default"
)
if not defined BROWSER if exist "%ProgramFiles%\BraveSoftware\Brave-Browser\Application\brave.exe" (
  set "BROWSER=%ProgramFiles%\BraveSoftware\Brave-Browser\Application\brave.exe"
  set "PROFILE_ARG=--profile-directory=Default"
)
if not defined BROWSER if exist "%ProgramFiles(x86)%\BraveSoftware\Brave-Browser\Application\brave.exe" (
  set "BROWSER=%ProgramFiles(x86)%\BraveSoftware\Brave-Browser\Application\brave.exe"
  set "PROFILE_ARG=--profile-directory=Default"
)
if not defined BROWSER if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
  set "BROWSER=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
  set "PROFILE_ARG=--profile-directory=Default"
)
if not defined BROWSER if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  set "PROFILE_ARG=--profile-directory=Default"
)
if not defined BROWSER if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  set "BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
  set "PROFILE_ARG=--profile-directory=Default"
)

if not defined BROWSER (
  echo Khong tim thay Brave, Microsoft Edge hoac Google Chrome.
  echo Dang mo trang EdTech bang trinh duyet mac dinh...
  start "" "%APP_HOME%"
  pause
  exit /b 1
)

set "APP_ARGS=%PROFILE_ARG% --app=%APP_URL% --start-maximized"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "$shell=New-Object -ComObject WScript.Shell;" ^
  "$desktop=[Environment]::GetFolderPath('Desktop');" ^
  "$startMenu=Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs';" ^
  "$targets=@((Join-Path $desktop '%APP_NAME%.lnk'),(Join-Path $startMenu '%APP_NAME%.lnk'));" ^
  "foreach($target in $targets){$shortcut=$shell.CreateShortcut($target);$shortcut.TargetPath='%BROWSER%';$shortcut.Arguments='%APP_ARGS%';$shortcut.WorkingDirectory=(Split-Path '%BROWSER%');if(Test-Path '%ICON_FILE%'){$shortcut.IconLocation='%ICON_FILE%,0'};$shortcut.Description='EdTech LMS Pro';$shortcut.WindowStyle=1;$shortcut.Save()}" ^
  >nul 2>&1

if errorlevel 1 (
  echo Khong the tao shortcut. Hay bam chuot phai va chon Run as administrator, sau do thu lai.
  pause
  exit /b 1
)

start "" "%BROWSER%" %APP_ARGS%

echo.
echo Da cai EdTech LMS Pro vao Desktop va Start Menu.
timeout /t 2 >nul
exit /b 0
