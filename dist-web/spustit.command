#!/bin/bash
cd "$(dirname "$0")"
echo "Spoustim aplikaci..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python neni nainstalovan. Oteviram stranku ke stazeni..."
    open "https://www.python.org/downloads/"
    echo "Po instalaci Pythonu spustte tento skript znovu."
    exit 1
fi

echo "Spoustim server..."
python3 -c "import http.server,socketserver,webbrowser,os; PORT=8000; print(f'Server bezi na http://localhost:{PORT}'); webbrowser.open(f'http://localhost:{PORT}'); os.chdir(os.path.dirname(os.path.abspath(__file__))); handler=http.server.SimpleHTTPRequestHandler; httpd=socketserver.TCPServer(('', PORT), handler); httpd.serve_forever()"
