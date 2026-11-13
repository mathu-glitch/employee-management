@echo off
echo ========================================================
echo Launching Mini Employee Management System
echo ========================================================
start "FastAPI Backend" cmd /k "cd /d %~dp0 && start-backend.bat"
start "Next.js Frontend" cmd /k "cd /d %~dp0 && start-frontend.bat"
echo.
echo Both servers have been launched in separate terminal windows!
echo - Backend API:  http://localhost:8000
echo - Swagger Docs: http://localhost:8000/docs
echo - Frontend UI:  http://localhost:3000
echo.
pause

