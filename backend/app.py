import os
import sqlite3
from datetime import datetime, timezone

def now():
    return datetime.now(timezone.utc).isoformat()
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), "beauty_store.db")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "knewbeauty2025")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def auth(req):
    return req.headers.get("X-Admin-Password") == ADMIN_PASSWORD


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
            location    TEXT,
            image_url   TEXT
        )
    """)
    try:
        cur.execute("ALTER TABLE products ADD COLUMN image_url TEXT")
    except Exception:
        pass

    cur.execute("""
        CREATE TABLE IF NOT EXISTS product_views (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            viewed_at  TEXT    NOT NULL
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS suggestions (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            name         TEXT,
            email        TEXT,
            message      TEXT NOT NULL,
            submitted_at TEXT NOT NULL,
            read         INTEGER DEFAULT 0
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS articles (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            title        TEXT NOT NULL,
            slug         TEXT NOT NULL UNIQUE,
            content      TEXT NOT NULL,
            excerpt      TEXT,
            image_url    TEXT,
            published    INTEGER DEFAULT 1,
            created_at   TEXT NOT NULL,
            updated_at   TEXT NOT NULL
        )
    """)

    cur.execute("SELECT COUNT(*) FROM products")
    if cur.fetchone()[0] == 0:
        products = [
            ("Rose Glow Foundation",       "LuminaBeauty", "Foundation", 34.99, "Full-coverage buildable formula with SPF 15",       1, "Aisle 3, Shelf B", ""),
            ("HD Powder Foundation",        "ColorCraft",   "Foundation", 29.99, "Lightweight powder for a natural finish",            1, "Aisle 3, Shelf A", ""),
            ("Velvet Matte Lipstick",       "LuminaBeauty", "Lips",       18.99, "Long-lasting matte with a comfortable feel",        1, "Aisle 1, Shelf A", ""),
            ("Glossy Lip Gloss",            "PureGlow",     "Lips",       12.99, "High-shine, non-sticky formula",                    1, "Aisle 1, Shelf C", ""),
            ("Coconut Lip Balm",            "PureGlow",     "Lips",        8.99, "Nourishing coconut-infused daily lip balm",         1, "Aisle 1, Shelf B", ""),
            ("Hydra Boost Serum",           "GlowLab",      "Skincare",   52.00, "Hyaluronic acid serum for deep hydration",          1, "Aisle 5, Shelf C", ""),
            ("SPF 50 Tinted Moisturizer",   "GlowLab",      "Skincare",   38.00, "Lightweight sun protection with a skin-tone tint",  1, "Aisle 5, Shelf A", ""),
            ("Retinol Night Cream",         "GlowLab",      "Skincare",   65.00, "Anti-aging retinol cream for overnight renewal",    1, "Aisle 5, Shelf B", ""),
            ("Vitamin C Brightening Mask",  "GlowLab",      "Skincare",   45.00, "Weekly brightening treatment mask",                 1, "Aisle 5, Shelf D", ""),
            ("Smoky Eye Palette",           "ColorCraft",   "Eyes",       42.50, "12 versatile eyeshadow shades",                     1, "Aisle 2, Shelf D", ""),
            ("Curl Defining Mascara",       "ColorCraft",   "Eyes",       16.99, "Volumizing and curling mascara",                    1, "Aisle 2, Shelf C", ""),
            ("Waterproof Eyeliner",         "ColorCraft",   "Eyes",       14.50, "Precise waterproof gel eyeliner",                   1, "Aisle 2, Shelf B", ""),
            ("Natural Blush",               "PureGlow",     "Cheeks",     22.00, "Buildable peachy-pink powder blush",                0, "Aisle 2, Shelf A", ""),
            ("Bronzing Drops",              "ColorCraft",   "Face",       32.00, "Customisable liquid bronzer drops",                 1, "Aisle 3, Shelf D", ""),
            ("Contouring Stick",            "LuminaBeauty", "Face",       28.00, "Easy-blend contouring and highlighting stick",      1, "Aisle 3, Shelf A", ""),
            ("Setting Powder",              "LuminaBeauty", "Face",       26.99, "Translucent finishing powder for all skin tones",   0, "Aisle 3, Shelf C", ""),
        ]
        cur.executemany(
            "INSERT INTO products (name, brand, category, price, description, in_stock, location, image_url) VALUES (?,?,?,?,?,?,?,?)",
            products,
        )

    cur.execute("SELECT COUNT(*) FROM articles")
    if cur.fetchone()[0] == 0:
        ts = now()
        articles = [
            ("5 Must-Have Products for Dark Skin Tones", "5-must-have-dark-skin",
             "Finding the right beauty products for deep skin tones can be challenging, but at KnewBeauty we have you covered. From foundations that truly match to highlighters that pop on melanin-rich skin, here are our top picks...\n\nFirst, look for foundations with warm undertones — avoid anything with pink or cool bases as they can look ashy. Our Rose Glow Foundation is specifically formulated to complement deeper complexions.\n\nFor lips, bold colors like deep plum, rich burgundy, and bright coral look stunning. Our Velvet Matte Lipstick range includes shades perfect for every dark skin tone.\n\nHighlighters with gold and bronze tones work best — they complement the warmth in deeper complexions rather than washing them out.",
             "Discover the best beauty products specifically curated for dark and deep skin tones at KnewBeauty.",
             "", 1, ts, ts),
            ("The Ultimate Skincare Routine for Melanin-Rich Skin", "skincare-routine-melanin",
             "Melanin-rich skin has unique needs and incredible strengths. Here is your ultimate guide to a skincare routine that celebrates and protects your beautiful skin...\n\nStep 1 — Cleanse gently. Avoid harsh soaps that strip natural oils. Look for cream or oil-based cleansers.\n\nStep 2 — Tone and balance. Witch hazel or rose water toners work beautifully for all skin types.\n\nStep 3 — Serum. Our Hydra Boost Serum with hyaluronic acid deeply hydrates without clogging pores.\n\nStep 4 — Moisturize. Shea butter and jojoba oil are your best friends.\n\nStep 5 — SPF every single day. Yes, even with melanin — sun protection prevents hyperpigmentation and dark spots.",
             "Your complete guide to building a skincare routine that works for melanin-rich skin.",
             "", 1, ts, ts),
            ("How to Find Your Perfect Foundation Shade", "perfect-foundation-shade",
             "Finding the right foundation shade is an art — but once you know your undertone, it becomes so much easier...\n\nUndertones fall into three categories: warm (yellow, peachy, golden), cool (pink, red, bluish), and neutral (a mix of both).\n\nTo find yours, look at the veins on your wrist. Green veins = warm undertone. Blue/purple = cool undertone. Both = neutral.\n\nAt KnewBeauty, our team can help you swatch and test foundations to find your exact match. Don't buy online until you have tested in store — lighting matters!",
             "Stop guessing your foundation shade. Here is the definitive guide to finding your perfect match.",
             "", 1, ts, ts),
        ]
        cur.executemany(
            "INSERT INTO articles (title, slug, content, excerpt, image_url, published, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
            articles,
        )

    conn.commit()
    conn.close()


# ── Admin auth ───────────────────────────────────────────────────────────────

@app.route("/api/admin/verify", methods=["POST"])
def verify_admin():
    data = request.json or {}
    if data.get("password") == ADMIN_PASSWORD:
        return jsonify({"ok": True})
    return jsonify({"ok": False}), 401


# ── Products ─────────────────────────────────────────────────────────────────

@app.route("/api/products", methods=["GET"])
def get_products():
    conn = get_db()
    rows = conn.execute("SELECT * FROM products ORDER BY category, name").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/products/<int:pid>/view", methods=["POST"])
def track_view(pid):
    conn = get_db()
    conn.execute("INSERT INTO product_views (product_id, viewed_at) VALUES (?, ?)",
                 (pid, now()))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


@app.route("/api/products", methods=["POST"])
def create_product():
    if not auth(request):
        return jsonify({"error": "Unauthorized"}), 401
    d = request.json
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO products (name, brand, category, price, description, in_stock, location, image_url) VALUES (?,?,?,?,?,?,?,?)",
        (d["name"], d["brand"], d["category"], float(d["price"]),
         d.get("description", ""), int(d.get("in_stock", 1)),
         d.get("location", ""), d.get("image_url", "")),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM products WHERE id=?", (cur.lastrowid,)).fetchone()
    conn.close()
    return jsonify(dict(row)), 201


@app.route("/api/products/<int:pid>", methods=["PUT"])
def update_product(pid):
    if not auth(request):
        return jsonify({"error": "Unauthorized"}), 401
    d = request.json
    conn = get_db()
    conn.execute(
        "UPDATE products SET name=?, brand=?, category=?, price=?, description=?, in_stock=?, location=?, image_url=? WHERE id=?",
        (d["name"], d["brand"], d["category"], float(d["price"]),
         d.get("description", ""), int(d.get("in_stock", 1)),
         d.get("location", ""), d.get("image_url", ""), pid),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM products WHERE id=?", (pid,)).fetchone()
    conn.close()
    return jsonify(dict(row))


@app.route("/api/products/<int:pid>", methods=["DELETE"])
def delete_product(pid):
    if not auth(request):
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    conn.execute("DELETE FROM products WHERE id=?", (pid,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


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


# ── Analytics ────────────────────────────────────────────────────────────────

@app.route("/api/admin/analytics", methods=["GET"])
def get_analytics():
    if not auth(request):
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()

    top_products = conn.execute("""
        SELECT p.id, p.name, p.category, p.location, COUNT(v.id) as views
        FROM products p
        LEFT JOIN product_views v ON p.id = v.product_id
        GROUP BY p.id
        ORDER BY views DESC
        LIMIT 10
    """).fetchall()

    category_views = conn.execute("""
        SELECT p.category, COUNT(v.id) as views
        FROM products p
        LEFT JOIN product_views v ON p.id = v.product_id
        GROUP BY p.category
        ORDER BY views DESC
    """).fetchall()

    total_views = conn.execute("SELECT COUNT(*) FROM product_views").fetchone()[0]
    total_products = conn.execute("SELECT COUNT(*) FROM products").fetchone()[0]
    unread_suggestions = conn.execute("SELECT COUNT(*) FROM suggestions WHERE read=0").fetchone()[0]

    location_suggestions = conn.execute("""
        SELECT p.name, p.location, COUNT(v.id) as views
        FROM products p
        LEFT JOIN product_views v ON p.id = v.product_id
        GROUP BY p.id
        ORDER BY views DESC
        LIMIT 5
    """).fetchall()

    conn.close()
    return jsonify({
        "total_views": total_views,
        "total_products": total_products,
        "unread_suggestions": unread_suggestions,
        "top_products": [dict(r) for r in top_products],
        "category_views": [dict(r) for r in category_views],
        "location_suggestions": [dict(r) for r in location_suggestions],
    })


# ── Suggestions ───────────────────────────────────────────────────────────────

@app.route("/api/suggestions", methods=["POST"])
def submit_suggestion():
    d = request.json or {}
    if not d.get("message", "").strip():
        return jsonify({"error": "Message required"}), 400
    conn = get_db()
    conn.execute(
        "INSERT INTO suggestions (name, email, message, submitted_at) VALUES (?,?,?,?)",
        (d.get("name", ""), d.get("email", ""), d["message"], now()),
    )
    conn.commit()
    conn.close()
    return jsonify({"ok": True}), 201


@app.route("/api/admin/suggestions", methods=["GET"])
def get_suggestions():
    if not auth(request):
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    rows = conn.execute("SELECT * FROM suggestions ORDER BY submitted_at DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/admin/suggestions/<int:sid>/read", methods=["PUT"])
def mark_read(sid):
    if not auth(request):
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    conn.execute("UPDATE suggestions SET read=1 WHERE id=?", (sid,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


# ── Articles / Blog ───────────────────────────────────────────────────────────

@app.route("/api/articles", methods=["GET"])
def get_articles():
    conn = get_db()
    rows = conn.execute("SELECT * FROM articles WHERE published=1 ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/articles/<slug>", methods=["GET"])
def get_article(slug):
    conn = get_db()
    row = conn.execute("SELECT * FROM articles WHERE slug=? AND published=1", (slug,)).fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "Not found"}), 404
    return jsonify(dict(row))


@app.route("/api/articles", methods=["POST"])
def create_article():
    if not auth(request):
        return jsonify({"error": "Unauthorized"}), 401
    d = request.json
    ts = now()
    slug = d["title"].lower().replace(" ", "-").replace("'", "")[:60]
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO articles (title, slug, content, excerpt, image_url, published, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
        (d["title"], slug, d["content"], d.get("excerpt", ""), d.get("image_url", ""),
         int(d.get("published", 1)), now, now),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM articles WHERE id=?", (cur.lastrowid,)).fetchone()
    conn.close()
    return jsonify(dict(row)), 201


@app.route("/api/articles/<int:aid>", methods=["PUT"])
def update_article(aid):
    if not auth(request):
        return jsonify({"error": "Unauthorized"}), 401
    d = request.json
    ts = now()
    conn = get_db()
    conn.execute(
        "UPDATE articles SET title=?, content=?, excerpt=?, image_url=?, published=?, updated_at=? WHERE id=?",
        (d["title"], d["content"], d.get("excerpt", ""), d.get("image_url", ""),
         int(d.get("published", 1)), now, aid),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM articles WHERE id=?", (aid,)).fetchone()
    conn.close()
    return jsonify(dict(row))


@app.route("/api/articles/<int:aid>", methods=["DELETE"])
def delete_article(aid):
    if not auth(request):
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    conn.execute("DELETE FROM articles WHERE id=?", (aid,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


init_db()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
