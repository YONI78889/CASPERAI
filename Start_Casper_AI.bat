@echo off
title CASPER AI CLEAN
echo Installing packages...
call npm install
echo.
echo Starting CASPER AI...
start http://localhost:3000
call npm start
pause
