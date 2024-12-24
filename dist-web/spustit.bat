@echo off
echo Spoustim aplikaci...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python neni nainstalovan. Stahuji portable verzi...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.12.1/python-3.12.1-embed-amd64.zip' -OutFile 'python.zip'}"
    powershell -Command "& {Expand-Archive -Path 'python.zip' -DestinationPath 'python'}"
    del python.zip
    set PYTHON_PATH=%~dp0python\python.exe
) else (
    set PYTHON_PATH=python
)

echo Spoustim server...
start "" "%PYTHON_PATH%" -c "import http.server,socketserver,webbrowser,os; PORT=8000; print(f'Server bezi na http://localhost:{PORT}'); webbrowser.open(f'http://localhost:{PORT}'); os.chdir(os.path.dirname(os.path.abspath(__file__))); handler=http.server.SimpleHTTPRequestHandler; httpd=socketserver.TCPServer(('', PORT), handler); httpd.serve_forever()"
