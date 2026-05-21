import os
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), "beauty_store.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            brand       TEXT    NOT NULL,
            category    TEXT    NOT NULL,
            price       REAL    NOT NULL,
            description TEXT,
            in_stock    INTEGER DEFAULT 1,
            location    TEXT
        )
    """)
    cur.execute("SELECT COUNT(*) FROM products")
    if cur.fetchone()[0] == 0:
        products = [
            ("Rose Glow Foundation",        "LuminaBeauty", "Foundation", 34.99, "Full-coverage buildable formula with SPF 15",            1, "Aisle 3, Shelf B"),
            ("HD Powder Foundation",         "ColorCraft",   "Foundation", 29.99, "Lightweight powder for a natural finish",                 1, "Aisle 3, Shelf A"),
            ("Velvet Matte Lipstick",        "LuminaBeauty", "Lips",       18.99, "Long-lasting matte with a comfortable feel",             1, "Aisle 1, Shelf A"),
            ("Glossy Lip Gloss",             "PureGlow",     "Lips",       12.99, "High-shine, non-sticky formula",                         1, "Aisle 1, Shelf C"),
            ("Coconut Lip Balm",             "PureGlow",     "Lips",        8.99, "Nourishing coconut-infused daily lip balm",              1, "Aisle 1, Shelf B"),
            ("Hydra Boost Serum",            "GlowLab",      "Skincare",   52.00, "Hyaluronic acid serum for deep hydration",               1, "Aisle 5, Shelf C"),
            ("SPF 50 Tinted Moisturizer",    "GlowLab",      "Skincare",   38.00, "Lightweight sun protection with a skin-tone tint",       1, "Aisle 5, Shelf A"),
            ("Retinol Night Cream",          "GlowLab",      "Skincare",   65.00, "Anti-aging retinol cream for overnight renewal",         1, "Aisle 5, Shelf B"),
            ("Vitamin C Brightening Mask",   "GlowLab",      "Skincare",   45.00, "Weekly brightening treatment mask",                      1, "Aisle 5, Shelf D"),
            ("Smoky Eye Palette",            "ColorCraft",   "Eyes",       42.50, "12 versatile eyeshadow shades",                          1, "Aisle 2, Shelf D"),
            ("Curl Defining Mascara",        "ColorCraft",   "Eyes",       16.99, "Volumizing and curling mascara",                         1, "Aisle 2, Shelf C"),
            ("Waterproof Eyeliner",          "ColorCraft",   "Eyes",       14.50, "Precise waterproof gel eyeliner",                        1, "Aisle 2, Shelf B"),
            ("Natural Blush",                "PureGlow",     "Cheeks",     22.00, "Buildable peachy-pink powder blush",                     0, "Aisle 2, Shelf A"),
            ("Bronzing Drops",               "ColorCraft",   "Face",       32.00, "Customisable liquid bronzer drops",                      1, "Aisle 3, Shelf D"),
            ("Contouring Stick",             "LuminaBeauty", "Face",       28.00, "Easy-blend contouring and highlighting stick",           1, "Aisle 3, Shelf A"),
            ("Setting Powder",               "LuminaBeauty", "Face",       26.99, "Translucent finishing powder for all skin tones",        0, "Aisle 3, Shelf C"),
        ]
        cur.executemany(
            "INSERT INTO products (name, brand, category, price, description, in_stock, location) VALUES (?,?,?,?,?,?,?)",
            products,
        )
        conn.commit()
    conn.close()


# ── Routes ──────────────────────────────────────────────────────────────────

@app.route("/api/products", methods=["GET"])
def get_products():
    conn = get_db()
    rows = conn.execute("SELECT * FROM products ORDER BY category, name").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/products/search", methods=["GET"])
def search_products():
    query    = request.args.get("q", "").strip()
    category = request.args.get("category", "").strip()

    sql, params = "SELECT * FROM products WHERE 1=1", []

    if query:
        sql += " AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)"
        like = f"%{query}%"
        params += [like, like, like]

    if category:
        sql += " AND category = ?"
        params.append(category)

    sql += " ORDER BY category, name"

    conn = get_db()
    rows = conn.execute(sql, params).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/categories", methods=["GET"])
def get_categories():
    conn = get_db()
    rows = conn.execute("SELECT DISTINCT category FROM products ORDER BY category").fetchall()
    conn.close()
    return jsonify([r["category"] for r in rows])


init_db()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
