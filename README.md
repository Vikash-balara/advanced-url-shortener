# Advanced URL Shortener

A full-stack URL shortener built using React, FastAPI, SQLite, and Tailwind CSS.

---

# Features

- Shorten long URLs
- Redirect to original URL
- Copy shortened URLs
- URL history dashboard
- Click analytics
- Responsive UI
- FastAPI backend
- SQLite database
- Environment variable support

---

# Tech Stack

## Frontend

- React
- Vite
- Axios
- Tailwind CSS

## Backend

- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

---

# Project Structure

advanced-url-shortener/

├── backend/
│   ├── app/
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│
├── README.md

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/Vikash-balara/advanced-url-shortener
```

---

# Backend Setup

## 1. Open Backend Folder

```bash
cd backend
```

## 2. Create Virtual Environment

```bash
python -m venv venv
```

## 3. Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

## 4. Install Dependencies

```bash
pip install -r requirements.txt
```

## 5. Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```txt
http://127.0.0.1:8000
```

---

# Frontend Setup

## 1. Open Frontend Folder

```bash
cd frontend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Create Environment File

Create:

```txt
.env
```

Add:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## 4. Run Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# API Endpoints

## Create Short URL

```http
POST /shorten
```

---

## URL History

```http
GET /history
```

---

## Analytics

```http
GET /analytics
```

---

## Redirect URL

```http
GET /{short_code}
```

---

# Future Improvements

- User authentication
- QR code generation
- Custom short URLs
- Charts dashboard
- PostgreSQL database
- Docker support
- Deployment

---

# Author

Vikash Balara
