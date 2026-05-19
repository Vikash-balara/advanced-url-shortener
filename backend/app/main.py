from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder

from sqlalchemy.orm import Session

from .database import SessionLocal, engine
from .models import Base, URL
from .utils import generate_short_code
from .schemas import URLRequest

# Create database tables

Base.metadata.create_all(bind=engine)

# FastAPI app

app = FastAPI()

# CORS configuration

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home route

@app.get("/")
def home():

    return {
        "message": "URL Shortener API Running"
    }

# Create short URL

@app.post("/shorten")
def shorten_url(data: URLRequest):

    db: Session = SessionLocal()

    try:

        # Generate short code

        short_code = generate_short_code()

        # Create database object

        new_url = URL(
            original_url=data.original_url,
            short_code=short_code
        )

        # Save to database

        db.add(new_url)

        db.commit()

        db.refresh(new_url)

        # Return short URL

        return {
            "id": new_url.id,
            "original_url": new_url.original_url,
            "short_url": f"http://127.0.0.1:8000/{new_url.short_code}",
            "clicks": new_url.clicks
        }

    finally:

        db.close()

# Redirect route



# URL history + analytics

@app.get("/history")
def get_history():

    db: Session = SessionLocal()

    try:

        urls = db.query(URL).order_by(URL.id.desc()).all()

        result = []

        for url in urls:

            result.append({
                "id": url.id,
                "original_url": url.original_url,
                "short_url": f"http://127.0.0.1:8000/{url.short_code}",
                "short_code": url.short_code,
                "clicks": url.clicks
            })

        return jsonable_encoder(result)

    finally:

        db.close()

# Total analytics

@app.get("/analytics")
def analytics():

    db: Session = SessionLocal()

    try:

        urls = db.query(URL).all()

        total_urls = len(urls)

        total_clicks = sum(url.clicks for url in urls)

        most_clicked = None

        if urls:

            top_url = max(urls, key=lambda x: x.clicks)

            most_clicked = {
                "original_url": top_url.original_url,
                "short_url": f"http://127.0.0.1:8000/{top_url.short_code}",
                "clicks": top_url.clicks
            }

        return {
            "total_urls": total_urls,
            "total_clicks": total_clicks,
            "most_clicked": most_clicked
        }

    finally:

        db.close()

@app.get("/{short_code}")
def redirect_url(short_code: str):

    db: Session = SessionLocal()

    try:

        # Find URL

        url = db.query(URL).filter(
            URL.short_code == short_code
        ).first()

        # URL exists

        if url:

            # Increase clicks

            url.clicks += 1

            db.commit()

            # Redirect user

            return RedirectResponse(url.original_url)

        # URL not found

        return {
            "error": "URL not found"
        }

    finally:

        db.close()