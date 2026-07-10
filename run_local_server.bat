@echo off
title The House of Azmani's - Local Server
echo Starting local web server...
echo ------------------------------------------
echo Open this URL in your web browser:
echo http://localhost:8000/
echo ------------------------------------------
echo Press Ctrl+C in this command window to stop.
start http://localhost:8000/
python -m http.server 8000
pause
