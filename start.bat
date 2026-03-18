@echo off
echo =======================================================
echo         CivicVoice Hackathon Project Setup
echo =======================================================

echo.
echo [1/3] Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo.
echo [2/3] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo [3/3] Starting Servers...
echo Starting Backend on Port 5000...
start "CivicVoice Backend" cmd /c "cd backend && npm run dev"

echo Starting Frontend on Port 5173...
start "CivicVoice Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo =======================================================
echo Servers are starting in separate windows!
echo Backend API : http://localhost:5000
echo Frontend UI : http://localhost:5173
echo =======================================================
pause
