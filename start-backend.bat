@echo off
title FastAPI Backend - Mini Employee Management System
echo ========================================================
echo Starting FastAPI Backend on http://localhost:8000
echo Swagger API Docs: http://localhost:8000/docs
echo ========================================================
cd /d "%~dp0backend"

if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Checking and installing dependencies...
pip install -r requirements.txt

echo Launching server with auto-reload...
python run.py
pause

