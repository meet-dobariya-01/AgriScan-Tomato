@echo off
echo ========================================
echo  Tomato Disease Classification
echo  Installation Script
echo ========================================
echo.

echo Creating virtual environment...
python -m venv venv

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo To run the application:
echo   1. Run: run_app.bat
echo   2. Or manually: streamlit run app.py
echo.
pause
