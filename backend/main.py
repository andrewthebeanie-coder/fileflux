from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import subprocess
import tempfile
import os
import io
import shutil
from pathlib import Path

app = FastAPI(title="Fileflux API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CONVERSIONS = {
    "jpg-to-png":   ("jpg",  "png",  "image"),
    "png-to-jpg":   ("png",  "jpg",  "image"),
    "heic-to-jpg":  ("heic", "jpg",  "image"),
    "webp-to-png":  ("webp", "png",  "image"),
    "mp4-to-mp3":   ("mp4",  "mp3",  "ffmpeg"),
    "mp4-to-mov":   ("mp4",  "mov",  "ffmpeg"),
    "mov-to-mp4":   ("mov",  "mp4",  "ffmpeg"),
    "mp3-to-wav":   ("mp3",  "wav",  "ffmpeg"),
    "wav-to-flac":  ("wav",  "flac", "ffmpeg"),
    "flac-to-mp3":  ("flac", "mp3",  "ffmpeg"),
    "ogg-to-mp3":   ("ogg",  "mp3",  "ffmpeg"),
    "pdf-to-word":  ("pdf",  "docx", "pdf"),
}

MIME_TYPES = {
    "jpg":  "image/jpeg",
    "png":  "image/png",
    "webp": "image/webp",
    "mp3":  "audio/mpeg",
    "wav":  "audio/wav",
    "flac": "audio/flac",
    "ogg":  "audio/ogg",
    "mp4":  "video/mp4",
    "mov":  "video/quicktime",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


@app.get("/")
def root():
    return {"status": "Fileflux API running"}


@app.get("/conversions")
def list_conversions():
    return list(CONVERSIONS.keys())


@app.post("/convert/{conversion_id}")
async def convert(conversion_id: str, file: UploadFile = File(...)):
    if conversion_id not in CONVERSIONS:
        raise HTTPException(status_code=404, detail="Conversion not supported")

    src_ext, dst_ext, method = CONVERSIONS[conversion_id]
    tmpdir = tempfile.mkdtemp()

    try:
        input_path = os.path.join(tmpdir, f"input.{src_ext}")
        output_path = os.path.join(tmpdir, f"output.{dst_ext}")

        contents = await file.read()
        with open(input_path, "wb") as f:
            f.write(contents)

        if method == "image":
            from PIL import Image
            img = Image.open(input_path)
            if dst_ext == "jpg":
                img = img.convert("RGB")
            img.save(output_path)

        elif method == "ffmpeg":
            cmd = ["ffmpeg", "-y", "-i", input_path, output_path]
            result = subprocess.run(cmd, capture_output=True, timeout=120)
            if result.returncode != 0:
                raise HTTPException(status_code=500, detail="Conversion failed")

        elif method == "pdf":
            from pdf2docx import Converter
            cv = Converter(input_path)
            cv.convert(output_path)
            cv.close()

        with open(output_path, "rb") as f:
            data = f.read()

        mime = MIME_TYPES.get(dst_ext, "application/octet-stream")
        original_name = Path(file.filename).stem
        download_name = f"{original_name}.{dst_ext}"

        return StreamingResponse(
            io.BytesIO(data),
            media_type=mime,
            headers={"Content-Disposition": f'attachment; filename="{download_name}"'}
        )

    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)
