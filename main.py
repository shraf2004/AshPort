from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, HTMLResponse


BASE_DIR = Path(__file__).resolve().parent
PUBLIC_FILES = {
    "about.html", "contact.html", "education.html", "index.html",
    "involve.html", "projects.html", "research.html", "resume.html", "skills.html",
    "portfolio.css", "portfolio.js", "favicon.svg", "Ash.pdf",
    "img.jpg", "david.jpg", "HackHarvard.jpg", "team.jpg", "Harvard.jpg",
    "mit.jpg", "john harvard.jpg",
}
app = FastAPI(title="Ashraful Islam Tutul | Portfolio")


@app.get("/", response_class=HTMLResponse)
async def read_root():
    return HTMLResponse((BASE_DIR / "index.html").read_text(encoding="utf-8"))


@app.get("/resume", response_class=FileResponse)
@app.get("/uploads/Resume.pdf", response_class=FileResponse)
async def download_resume():
    return FileResponse(
        BASE_DIR / "Ash.pdf",
        media_type="application/pdf",
        filename="Ashraful_Islam_Tutul_Resume.pdf",
    )


@app.get("/Ashraf.png", response_class=FileResponse)
async def profile_photo():
    return FileResponse(BASE_DIR / "Ashraf.png", media_type="image/png")


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.get("/{filename}", response_class=FileResponse)
async def public_file(filename: str):
    if filename not in PUBLIC_FILES:
        raise HTTPException(status_code=404)
    return FileResponse(BASE_DIR / filename)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
