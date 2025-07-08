import os
import sys
import platform
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class SimpleHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
    def do_GET(self):
        self._set_headers()
        response = {
            "message": "Hello from Python!",
            "python_version": sys.version,
            "platform": platform.platform(),
            "path": self.path
        }
        self.wfile.write(json.dumps(response).encode())

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleHandler)
    print(f"Starting server on port {port}")
    print(f"Python version: {sys.version}")
    print(f"Platform: {platform.platform()}")
    httpd.serve_forever()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    run_server(port)
