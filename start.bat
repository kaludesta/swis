@echo off
echo Starting Academic Dashboard...
echo.
echo Backend will run on: http://localhost:3000
echo Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop all servers
echo.
start cmd /k "npm run server"
timeout /t 2 /nobreak >nul
start cmd /k "npm run dev"
echo.
echo Servers are starting in separate windows...
echo.
