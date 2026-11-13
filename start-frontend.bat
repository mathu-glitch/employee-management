@echo off
title Next.js Frontend - Mini Employee Management System
echo ========================================================
echo Starting Next.js Frontend on http://localhost:3000
echo ========================================================
cd /d "%~dp0frontend"

if not exist node_modules (
    echo Installing npm dependencies...
    npm install
)

echo Starting Next.js dev server...
npm run dev
pause

