@echo off
setlocal EnableExtensions
chcp 65001 >nul

title Cài đặt EdTech LMS Pro
set "APP_NAME=EdTech LMS Pro"
set "APP_URL=https://tuanminhmoc.github.io/Edtech-LMS/#home"
set "APP_HOME=https://tuanminhmoc.github.io/Edtech-LMS/"
set "APP_DIR=%LOCALAPPDATA%\EdTech LMS Pro"
set "ICON_FILE=%APP_DIR%\EdTech LMS Pro.ico"
set "ICON_URL=https://tuanminhmoc.github.io/Edtech-LMS/assets/icons/EdTech-LMS-Pro.ico"

if not exist "%APP_DIR%" mkdir "%APP_DIR%" >nul 2>&1

rem Tải icon riêng. Nếu mạng lỗi, shortcut vẫn được tạo bằng icon trình duyệt.
powershell -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command ^
  "$ProgressPreference='SilentlyContinue'; try { Invoke-WebRequest -UseBasicParsing -Uri $env:ICON_URL -OutFile $env:ICON_FILE -TimeoutSec 15 -ErrorAction Stop } catch {}" ^
  >nul 2>&1

set "BROWSER="
set "PROFILE_ARG="

rem Ưu tiên Brave, sau đó Edge và Chrome.
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
  rem Windows 10/11 gần như luôn có Edge. Nếu không có, mở URL bằng trình duyệt mặc định rồi tự đóng.
  start "" "%APP_HOME%"
  exit /b 0
)

rem PowerShell tạo shortcut .lnk thật trên Desktop và Start Menu, rồi mở app ở cửa sổ riêng.
powershell -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "$shell=New-Object -ComObject WScript.Shell;" ^
  "$desktop=[Environment]::GetFolderPath('Desktop');" ^
  "$startMenu=Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs';" ^
  "$arguments=@(); if($env:PROFILE_ARG){$arguments+=$env:PROFILE_ARG}; $arguments+=('--app=' + [char]34 + $env:APP_URL + [char]34); $arguments+='--start-maximized'; $argLine=$arguments -join ' ';" ^
  "$targets=@((Join-Path $desktop ($env:APP_NAME+'.lnk')),(Join-Path $startMenu ($env:APP_NAME+'.lnk')));" ^
  "foreach($target in $targets){" ^
  "  $shortcut=$shell.CreateShortcut($target);" ^
  "  $shortcut.TargetPath=$env:BROWSER;" ^
  "  $shortcut.Arguments=$argLine;" ^
  "  $shortcut.WorkingDirectory=(Split-Path $env:BROWSER);" ^
  "  if(Test-Path $env:ICON_FILE){$shortcut.IconLocation=$env:ICON_FILE+',0'};" ^
  "  $shortcut.Description='EdTech LMS Pro';" ^
  "  $shortcut.WindowStyle=1;" ^
  "  $shortcut.Save();" ^
  "}" ^
  "Start-Process -FilePath $env:BROWSER -ArgumentList $argLine" ^
  >nul 2>&1

rem Không pause: cài xong cửa sổ BAT tự đóng ngay.
exit /b 0
