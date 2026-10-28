@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
set "NODEEXE=C:\Users\35238\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
if exist "%NODEEXE%" goto :run
set "NODEEXE=node"
where node >nul 2>nul
if errorlevel 1 goto :nonode
:run
echo.
echo   AI Daily Cover Studio  ->  http://127.0.0.1:7788
echo   Close this window to stop the server.
echo.
"%NODEEXE%" tools\serve.mjs 7788
if errorlevel 1 pause
exit /b 0
:nonode
echo.
echo   [ERROR] Node.js not found.
echo   Install Node 18+ , or edit NODEEXE in this file to point at node.exe
echo.
pause
exit /b 1
