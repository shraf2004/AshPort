from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse, HTMLResponse


BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
app = FastAPI(title="Ashraful Islam Tutul | Portfolio")


@app.get("/", response_class=HTMLResponse)
async def read_root():
    return HTMLResponse((BASE_DIR / "index.html").read_text(encoding="utf-8"))


@app.get("/resume", response_class=FileResponse)
@app.get("/uploads/Resume.pdf", response_class=FileResponse)
async def download_resume():
    return FileResponse(
        UPLOAD_DIR / "Resume.pdf",
        media_type="application/pdf",
        filename="Ashraful_Islam_Tutul_Resume.pdf",
    )


@app.get("/Ashraf.png", response_class=FileResponse)
async def profile_photo():
    return FileResponse(BASE_DIR / "Ashraf.png", media_type="image/png")


@app.get("/health")
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
