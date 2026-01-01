@echo off
REM Batch script to kill process on port 5000
REM Usage: kill-port.bat

echo Finding process on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process %%a...
    taskkill /PID %%a /F
    echo ✅ Port 5000 is now free.
    exit /b
)

echo ✅ Port 5000 is already free.


