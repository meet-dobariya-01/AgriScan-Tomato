@echo off
echo ========================================
echo  Tomato Disease Classification App
echo  Starting Streamlit Server...
echo ========================================
echo.

REM Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM Run Streamlit
streamlit run app.py

pause
