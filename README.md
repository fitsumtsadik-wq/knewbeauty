# Beauty Store Locator

A full-stack website to search and locate beauty products in-store.

- **Frontend**: React (Vite) → `http://localhost:3000`
- **Backend**: Python Flask API → `http://localhost:5000`
- **Database**: SQLite (auto-created on first run)

---

## Quick Start

Open **two terminals** and run one command in each.

### Terminal 1 — Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The API will start at `http://localhost:5000`.  
The SQLite database (`beauty_store.db`) and seed data are created automatically.

### Terminal 2 — Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Then open your browser to **http://localhost:3000**

---

## Project Structure

```
beauty-store-locator/
├── backend/
│   ├── app.py              # Flask web server + SQLite logic
│   ├── requirements.txt    # Python dependencies
│   └── beauty_store.db     # SQLite database (auto-created)
└── frontend/
    ├── index.html          # HTML entry point
    ├── package.json        # Node dependencies
    ├── vite.config.js      # Vite config (proxies /api → Flask)
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        └── components/
            ├── SearchBar.jsx
            ├── ProductCard.jsx
            └── ProductList.jsx
```

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/products` | All products |
| GET | `/api/products/search?q=lipstick` | Search by keyword |
| GET | `/api/products/search?category=Eyes` | Filter by category |
| GET | `/api/products/search?q=glow&category=Skincare` | Combined |
| GET | `/api/categories` | All distinct categories |

---

## Requirements

- **Python** 3.9+
- **Node.js** 18+
