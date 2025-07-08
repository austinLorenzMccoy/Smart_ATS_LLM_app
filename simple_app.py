from fastapi import FastAPI
import uvicorn
import sys
import platform
import os

# Create a very simple FastAPI app
app = FastAPI(title="Simple Test App")

@app.get("/")
async def root():
    return {
        "message": "Hello World",
        "python_version": sys.version,
        "platform": platform.platform(),
        "environment": os.environ.get("PYTHON_VERSION", "Not set")
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

# Simple main function to run the app
if __name__ == "__main__":
    # Get port from command line argument or use default
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
