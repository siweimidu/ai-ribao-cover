@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "NODE=C:\Users\35238\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE%" set "NODE=node"
echo.
echo   AI 日报封面工作室  ->  http://127.0.0.1:7788
echo   关闭此窗口即停止服务
echo.
"%NODE%" tools\serve.mjs 7788
pause
