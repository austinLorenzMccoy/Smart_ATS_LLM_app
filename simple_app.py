from fastapi import FastAPI
import uvicorn
import sys
import platform

app = FastAPI()

@app.get("/")
async def root():
    return {
        "message": "Hello World",
        "python_version": sys.version,
        "platform": platform.platform()
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)
