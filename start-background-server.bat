@echo off
REM Start your app with PM2 (permanent background server)
echo Starting permanent background server...
cd c:\Users\sunil\Downloads\internship-prediction-recommendation-system
pm2 resurrect
echo.
echo ✅ Server started in background!
echo.
echo Open your app at: http://localhost:8000
echo.
echo To view server status: pm2 status
echo To stop server: pm2 stop internship-app
echo To restart server: pm2 restart internship-app
echo.
pause
