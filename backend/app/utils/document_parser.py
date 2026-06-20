import io
from typing import BinaryIO

import pdfplumber
from docx import Document
from fastapi import HTTPException, UploadFile

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def _get_extension(filename: str) -> str:
    if not filename or "." not in filename:
        return ""
    return filename.rsplit(".", 1)[-1].lower()


def validate_resume_file(file: UploadFile, max_size_bytes: int) -> str:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    ext = _get_extension(file.filename)
    if f".{ext}" not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '.{ext}'. Only PDF and DOCX files are supported.",
        )

    if file.content_type and file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid content type '{file.content_type}'. Only PDF and DOCX files are supported.",
        )

    if file.size is not None and file.size > max_size_bytes:
        max_mb = max_size_bytes / (1024 * 1024)
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is {max_mb:.0f} MB.",
        )

    return ext


async def read_file_with_size_check(file: UploadFile, max_size_bytes: int) -> bytes:
    chunks: list[bytes] = []
    total = 0

    while True:
        chunk = await file.read(1024 * 1024)
        if not chunk:
            break
        total += len(chunk)
        if total > max_size_bytes:
            max_mb = max_size_bytes / (1024 * 1024)
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum allowed size is {max_mb:.0f} MB.",
            )
        chunks.append(chunk)

    content = b"".join(chunks)
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    return content


def extract_text_from_pdf(content: bytes) -> str:
    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
        text = "\n".join(pages).strip()
        if not text:
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from PDF. The file may be scanned or image-based.",
            )
        return text
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {exc}") from exc


def extract_text_from_docx(content: bytes) -> str:
    try:
        document = Document(io.BytesIO(content))
        paragraphs = [para.text.strip() for para in document.paragraphs if para.text.strip()]
        text = "\n".join(paragraphs).strip()
        if not text:
            raise HTTPException(status_code=422, detail="Could not extract text from DOCX file.")
        return text
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Failed to parse DOCX: {exc}") from exc


def parse_resume(content: bytes, extension: str) -> str:
    if extension == "pdf":
        return extract_text_from_pdf(content)
    if extension == "docx":
        return extract_text_from_docx(content)
    raise HTTPException(status_code=400, detail="Unsupported file type.")
