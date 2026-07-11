#!/usr/bin/env python3
"""
Bulk import products from store-layout.md into the knewbeauty SQLite database.

Usage:
    python import_products.py              # import only (no images)
    python import_products.py --images     # import + fetch product images
"""

import sys
import os
import re
import sqlite3
import time
import json

DB_PATH = os.path.join(os.path.dirname(__file__), "backend", "beauty_store.db")
IMG_CACHE = os.path.join(os.path.dirname(__file__), "image_cache.json")

FETCH_IMAGES = "--images" in sys.argv

# Accept markdown path as first non-flag argument, fall back to store-layout.md next to script
_args = [a for a in sys.argv[1:] if not a.startswith("--")]
MD_PATH = _args[0] if _args else os.path.join(os.path.dirname(__file__), "store-layout.md")

if not os.path.exists(MD_PATH):
    print(f"ERROR: markdown file not found: {MD_PATH}")
    print("Usage: python import_products.py [path/to/store-layout.md] [--images]")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Brand normalization — maps the text before "–" to a canonical brand name
# ---------------------------------------------------------------------------

BRAND_PREFIXES = [
    # listed longest-first so more specific matches win
    ("Tropic Isle Living", "Tropic Isle Living"),
    ("Tropic Isle Hair", "Tropic Isle Living"),
    ("Jamaican Mango & Lime", "Jamaican Mango & Lime"),
    ("Mielle Babassu & Mint", "Mielle"),
    ("Mielle Babassu", "Mielle"),
    ("Mielle Oats & Honey", "Mielle"),
    ("Mielle Kalahari Melon", "Mielle"),
    ("Mielle Mongongo Oil", "Mielle"),
    ("Mielle Moisture RX", "Mielle"),
    ("Mielle Avocado", "Mielle"),
    ("Mielle White Peony", "Mielle"),
    ("Mielle Mint Almond", "Mielle"),
    ("Mielle Pomegranate & Honey", "Mielle"),
    ("Mielle Rosemary Mint", "Mielle"),
    ("Mielle Sea Moss", "Mielle"),
    ("Mielle Honey & Ginger", "Mielle"),
    ("Mielle Mango & Tulsi", "Mielle"),
    ("Mielle Difeel", "Mielle"),
    ("Mielle", "Mielle"),
    ("Skala #MaisCachos", "Skala Brasil"),
    ("Skala Babosa", "Skala Brasil"),
    ("Skala Dona Skala", "Skala Brasil"),
    ("Skala Diva", "Skala Brasil"),
    ("Skala Divino", "Skala Brasil"),
    ("Skala PotÃ£o", "Skala Brasil"),
    ("Skala Bomba", "Skala Brasil"),
    ("Skala", "Skala Brasil"),
    ("Biosilk Silk Therapy", "Biosilk"),
    ("CHI Infra", "CHI"),
    ("CHI Iron", "CHI"),
    ("it's a 10", "it's a 10"),
    ("Olaplex No.", "Olaplex"),
    ("As I Am Jamaican", "As I Am"),
    ("As I Am Rosemary", "As I Am"),
    ("As I Am Rice Water", "As I Am"),
    ("As I Am Dry/Itchy", "As I Am"),
    ("As I Am Coconut", "As I Am"),
    ("As I Am Classic", "As I Am"),
    ("As I Am", "As I Am"),
    ("KeraCare", "KeraCare"),
    ("Mizani 25", "Mizani"),
    ("Mizani Press", "Mizani"),
    ("Mizani Butter", "Mizani"),
    ("Mizani Rhelaxer", "Mizani"),
    ("Mizani Moisture", "Mizani"),
    ("Mizani Coco", "Mizani"),
    ("Mizani Thermasmooth", "Mizani"),
    ("Mizani", "Mizani"),
    ("Design Essentials Almond & Avocado", "Design Essentials"),
    ("Design Essentials African Chebe", "Design Essentials"),
    ("Design Essentials Milk & Honey", "Design Essentials"),
    ("Design Essentials Oat Protein", "Design Essentials"),
    ("Design Essentials Honey Creme", "Design Essentials"),
    ("Design Essentials Peppermint & Aloe", "Design Essentials"),
    ("Design Essentials Kukui & Coconut", "Design Essentials"),
    ("Design Essentials Scalp Care", "Design Essentials"),
    ("Design Essentials", "Design Essentials"),
    ("The Doux Bre Chi", "The Doux"),
    ("The Doux", "The Doux"),
    ("Shea Moisture Manuka Honey", "SheaMoisture"),
    ("Shea Moisture Raw Shea", "SheaMoisture"),
    ("Shea Moisture Coconut & Hibiscus", "SheaMoisture"),
    ("Shea Moisture Jamaican", "SheaMoisture"),
    ("Shea Moisture Mango", "SheaMoisture"),
    ("Shea Moisture 2-in-1", "SheaMoisture"),
    ("Shea Moisture", "SheaMoisture"),
    ("Moroccanoil Curl", "Moroccanoil"),
    ("Moroccanoil Treatment", "Moroccanoil"),
    ("Moroccanoil", "Moroccanoil"),
    ("Camille Rose", "Camille Rose"),
    ("Carol's Daughter Black Vanilla", "Carol's Daughter"),
    ("Carol's Daughter Coco", "Carol's Daughter"),
    ("Carol's Daughter Goddess", "Carol's Daughter"),
    ("Carol's Daughter", "Carol's Daughter"),
    ("Not Your Mother's", "Not Your Mother's"),
    ("Bask & Lather", "Bask & Lather"),
    ("Mixed Chicks", "Mixed Chicks"),
    ("Kaleidoscope x DaBrat", "Kaleidoscope"),
    ("Kaleidoscope Kids", "Kaleidoscope"),
    ("Kaleidoscope", "Kaleidoscope"),
    ("Paul Mitchell", "Paul Mitchell"),
    ("KeraFix", "KeraFix"),
    ("tgin", "tgin"),
    ("Curls", "Curls"),
    ("ORS Olive Oil Girls", "ORS"),
    ("ORS Olive Oil Professional", "ORS"),
    ("ORS Olive Oil", "ORS"),
    ("ORS Fix-It", "ORS"),
    ("ORS HAIRestore", "ORS"),
    ("ORS", "ORS"),
    ("Creme of Nature Pink Kids", "Creme of Nature"),
    ("Creme of Nature Pure Honey", "Creme of Nature"),
    ("Creme of Nature Butter Blend", "Creme of Nature"),
    ("Creme of Nature Mango & Shea", "Creme of Nature"),
    ("Creme of Nature Argan Oil", "Creme of Nature"),
    ("Creme of Nature Coconut Milk", "Creme of Nature"),
    ("Creme of Nature Batana", "Creme of Nature"),
    ("Creme of Nature", "Creme of Nature"),
    ("Motions Professional", "Motions"),
    ("Motions", "Motions"),
    ("Cantu Shea Butter", "Cantu"),
    ("Cantu Avocado", "Cantu"),
    ("Cantu For Kids", "Cantu"),
    ("Cantu", "Cantu"),
    ("Aussie", "Aussie"),
    ("OGX", "OGX"),
    ("ApHogee", "ApHogee"),
    ("Silicon Mix BambÃº", "Silicon Mix"),
    ("Silicon Mix", "Silicon Mix"),
    ("Alberto VO5", "Alberto VO5"),
    ("Sulfur8 Kids", "Sulfur8"),
    ("Sulfur8", "Sulfur8"),
    ("DOO GRO", "DOO GRO"),
    ("Creme of Nature Pink", "Creme of Nature"),
    ("Just For Me Curl Peace", "Just For Me"),
    ("Just For Me Natural", "Just For Me"),
    ("Just For Me", "Just For Me"),
    ("Shea Moisture Mango & Carrot", "SheaMoisture"),
    ("Kids Originals by Africa's Best", "Africa's Best Kids"),
    ("Kids Originals", "Africa's Best Kids"),
    ("Dream Kids Olive Miracle", "Dream Kids"),
    ("Dream Kids", "Dream Kids"),
    ("AMBI Even & Clear", "AMBI"),
    ("AMBI", "AMBI"),
    ("Palmer's Skin Success", "Palmer's"),
    ("Palmer's Cocoa Butter Formula", "Palmer's"),
    ("Palmer's Coconut Oil Formula", "Palmer's"),
    ("Palmer's Shea Butter", "Palmer's"),
    ("Palmer's Jamaican Coco", "Palmer's"),
    ("Palmer's", "Palmer's"),
    ("Akwaaba", "Akwaaba"),
    ("Nkumbaa", "Nkumbaa"),
    ("Star Care", "Star Care"),
    ("Ashanti Naturals", "Ashanti Naturals"),
    ("Liz Professional", "Liz Professional"),
    ("Kojie San", "Kojie San"),
    ("Dudu-Osun", "Dudu-Osun"),
    ("WhiteSecret", "WhiteSecret"),
    ("Cococare", "Cococare"),
    ("Nadinola", "Nadinola"),
    ("Africare", "Africare"),
    ("Clear Essence", "Clear Essence"),
    ("Vitamin C Lotion", "Nature Fresh"),
    ("Dr. Bronner's", "Dr. Bronner's"),
    ("Queen Helene", "Queen Helene"),
    ("African Pride Olive Miracle", "African Pride"),
    ("African Pride Moisture Miracle", "African Pride"),
    ("African Pride Black Castor", "African Pride"),
    ("African Pride", "African Pride"),
    ("Africa's Best Herbal", "Africa's Best"),
    ("Africa's Best", "Africa's Best"),
    ("Hawaiian Silky", "Hawaiian Silky"),
    ("TCB Naturals", "TCB"),
    ("TCB", "TCB"),
    ("Gentle Treatment", "Gentle Treatment"),
    ("Dark & Lovely", "Dark & Lovely"),
    ("Revlon", "Revlon"),
    ("Optimum", "Optimum"),
    ("Luster's Pink", "Luster's"),
    ("Luster's S-Curl", "Luster's"),
    ("Luster's Comb Thru", "Luster's"),
    ("Luster's 5 Curl", "Luster's"),
    ("Luster's", "Luster's"),
    ("Taliah Waajid Black Earth", "Taliah Waajid"),
    ("Taliah Waajid", "Taliah Waajid"),
    ("EBIN Wonder Lace Bond", "EBIN New York"),
    ("EBIN New York", "EBIN New York"),
    ("EBIN", "EBIN New York"),
    ("Ebin New York", "EBIN New York"),
    ("TruEdge", "Tyche"),
    ("Tyche TruEDGE", "Tyche"),
    ("Tyche by Nicka K", "Tyche"),
    ("Tyche", "Tyche"),
    ("Aunt Jackie's", "Aunt Jackie's"),
    ("T-Tree by Parnevu", "Parnevu"),
    ("Murray's Beeswax", "Murray's"),
    ("Murray's", "Murray's"),
    ("Jamaican Mango & Lime", "Jamaican Mango & Lime"),
    ("All Day Locks", "All Day Locks"),
    ("Style Factor", "Style Factor"),
    ("BTL Professional", "BTL"),
    ("BTL", "BTL"),
    ("Goiple Hair Care", "Goiple"),
    ("Goiple", "Goiple"),
    ("Bellatique Kool", "Bellatique"),
    ("Bellatique", "Bellatique"),
    ("Taliah Waajid", "Taliah Waajid"),
    ("Got2b", "Got2b"),
    ("Shine 'n Jam", "Shine 'n Jam"),
    ("Eco Style", "Eco Style"),
    ("Let's Jam!", "Let's Jam!"),
    ("Ampro Pro Styl", "Ampro"),
    ("Vigorol", "Vigorol"),
    ("IC Fantasia", "Fantasia"),
    ("Fantasia IC", "Fantasia"),
    ("Fantasia", "Fantasia"),
    ("Blue Magic Originals", "Blue Magic"),
    ("Blue Magic", "Blue Magic"),
    ("Difeel Premium Hair Oil", "Difeel"),
    ("Difeel", "Difeel"),
    ("Isoplus", "Isoplus"),
    ("WaveBuilder", "WaveBuilder"),
    ("Groomane", "Groomane"),
    ("Level3", "Level3"),
    ("B Level", "Level3"),
    ("Uncle Jimmy", "Uncle Jimmy"),
    ("Well's Oil", "Well's Oil"),
    ("Wild Growth", "Wild Growth"),
    ("By Natures", "By Natures"),
    ("Absolute New York", "Absolute New York"),
    ("Absolute", "Absolute New York"),
    ("Nicka K", "Nicka K"),
    ("NK New York", "Nicka K"),
    ("NK (Nicka K)", "Nicka K"),
    ("Kiss New York", "Kiss New York"),
    ("Kiss Colors & Care", "Kiss Colors & Care"),
    ("Nair", "Nair"),
    ("GiGi Microwave", "GiGi"),
    ("GiGi Hard", "GiGi"),
    ("GiGi Hemp", "GiGi"),
    ("GiGi", "GiGi"),
    ("PoshMellow by Kana Cosmetics", "PoshMellow"),
    ("PoshMellow", "PoshMellow"),
    ("At-Home Spa Essentials", "At-Home Spa Essentials"),
    ("Dove Advanced Care", "Dove"),
    ("Dove Men+Care", "Dove"),
    ("Dove", "Dove"),
    ("Degree", "Degree"),
    ("Sea Breeze", "Sea Breeze"),
    ("Softfeet", "Softfeet"),
    ("Summer's Eve", "Summer's Eve"),
    ("African Essence", "African Essence"),
    ("Jamaican Mango & Lime", "Jamaican Mango & Lime"),
    ("Lottabody Coconut", "Lottabody"),
    ("Lottabody", "Lottabody"),
    ("Topiclear", "Topiclear"),
    ("Gluta White", "Gluta White"),
    ("Vaseline Blueseal", "Vaseline"),
    ("Vaseline", "Vaseline"),
    ("Turmeric Kojic Acid", "Turmeric"),
    ("Noxzema", "Noxzema"),
    ("B.B.Clear", "B.B.Clear"),
    ("Morgan's", "Morgan's"),
    ("Curcuma", "Curcuma Clear"),
    ("Codi", "Codi"),
    ("Groganics", "Groganics"),
    ("Razac", "Razac"),
    ("Baby Don't Be Bald", "Baby Don't Be Bald"),
    ("Natty", "Natty"),
    ("Lux Collection", "Lux Collection"),
    ("Edge Lux", "Lux Collection"),
    ("Braid Jelly", "Lux Collection"),
    ("Edge Grow", "Lux Collection"),
    ("edgefixer", "RED by Kiss"),
    ("Red by Kiss", "RED by Kiss"),
    ("RED by Kiss", "RED by Kiss"),
    ("She Is Bomb Collection", "She Is Bomb"),
    ("ON Natural", "ON Natural"),
    ("LOC N", "LOC N"),
    ("LocB", "Bellatique"),
    ("Pink Lemon", "Pink Lemon"),
    ("Red One", "Red One"),
    ("Gummy Professional", "Gummy Professional"),
    ("StylerFixer", "StylerFixer"),
    ("Vivatress", "Vivatress"),
    ("Latony", "Latony"),
    ("Hair Chemist", "Hair Chemist"),
    ("Clairol", "Clairol"),
    ("Greaseless", "Duke"),
    ("Nu-Nile", "Nu-Nile"),
    ("Dax", "Dax"),
    ("Royal Crown", "Royal Crown"),
    ("Clubman", "Clubman"),
    ("Osage Rub", "Osage Rub"),
    ("Jeris", "Jeris"),
    ("Sta-Sof-Fro", "Sta-Sof-Fro"),
    ("S-Curl", "Luster's"),
    ("Magic Grooming", "Magic"),
    ("Magic", "Magic"),
    ("Black Magic", "Black Magic"),
    ("Pro-Line Comb-Thru", "Pro-Line"),
    ("Pro-Line", "Pro-Line"),
    ("Beautiful Textures", "Beautiful Textures"),
    ("Texture My Way", "Texture My Way"),
    ("Shortlooks", "Shortlooks"),
    ("Pink", "Pink"),
    ("Kemi Oyl", "Kemi Oyl"),
    ("Natural Oasis", "Natural Oasis"),
    ("Hollywood Beauty", "Hollywood Beauty"),
    ("Kizu", "Kizu"),
    ("Softee", "Softee"),
    ("Nairobi", "Nairobi"),
    ("Sebastian Shaper Plus", "Sebastian"),
    ("Sebastian Shaper", "Sebastian"),
    ("Sebastian", "Sebastian"),
    ("Ampro Beautiful Child", "Ampro"),
    ("H&P", "H&P"),
    ("EZ Edges", "EZ Edges"),
    ("Instant Control", "Instant Control"),
    ("Caro White", "Caro White"),
    ("Carotone", "Carotone"),
    ("Nair Spa", "Nair"),
    ("Nair Bikini", "Nair"),
    ("Nair Face", "Nair"),
    ("Nair Wax", "Nair"),
    ("Nair Body", "Nair"),
    ("Nair Bladeless", "Nair"),
    ("African Formula", "African Formula"),
    ("Beneks'", "Beneks'"),
    ("African Black Soap", "Various"),
    ("Wish", "Wish"),
    ("BB (Bronner Bros)", "Bronner Brothers"),
    ("Lux Collection", "Lux Collection"),
]


def normalize_brand(text_before_dash):
    """Map the text before '–' to a canonical brand name."""
    s = text_before_dash.strip()
    for prefix, brand in BRAND_PREFIXES:
        if s.startswith(prefix):
            return brand
    # Fallback: return as-is (trimmed)
    return s or "Unknown"


def extract_brand_and_name(raw_item):
    """Split item name into (brand, name) using the em-dash delimiter."""
    # Normalize various dash encodings
    for delim in [" – ", " — ", " â ", " â ", " - "]:
        if delim in raw_item:
            parts = raw_item.split(delim, 1)
            brand_raw = parts[0].strip()
            brand = normalize_brand(brand_raw)
            return brand, raw_item.strip()
    # No delimiter found — try to detect brand from prefix list
    for prefix, brand in BRAND_PREFIXES:
        if raw_item.startswith(prefix):
            return brand, raw_item.strip()
    # Last resort: first word(s)
    words = raw_item.strip().split()
    brand = " ".join(words[:2]) if len(words) >= 2 else (words[0] if words else "Unknown")
    return brand, raw_item.strip()


def should_skip(item_text, confidence):
    """Return True for items we can't reliably catalog."""
    skip_phrases = [
        "~", "additional", "needs closer photo", "needs direct photo",
        "unlabeled", "brand unclear", "brand not fully legible",
        "brand partially", "not fully legible", "contents unclear",
    ]
    combined = (item_text + " " + confidence).lower()
    return any(p in combined for p in skip_phrases)


def parse_location_header(line):
    """Extract a clean location string from a ## or ### header."""
    text = re.sub(r"^#+\s*", "", line).strip()
    # Remove "Location:" prefix
    text = re.sub(r"^Location:\s*", "", text)
    # Remove bold markers
    text = text.replace("**", "")
    return text


def parse_markdown(filepath):
    """Parse store-layout.md and return a list of product dicts."""
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        lines = f.readlines()

    products = []
    main_location = ""
    sub_location = ""
    current_table_headers = []

    for raw_line in lines:
        line = raw_line.rstrip()

        # ── Section headers ──────────────────────────────────────────────────
        if line.startswith("## "):
            main_location = parse_location_header(line)
            sub_location = ""
            current_table_headers = []
            continue

        if line.startswith("### "):
            sub_location = parse_location_header(line)
            current_table_headers = []
            continue

        # ── Table header row ─────────────────────────────────────────────────
        if line.startswith("|") and "|" in line[1:]:
            cols = [c.strip() for c in line.split("|")[1:-1]]
            # Detect header rows by looking for "Item" or "Shelf" in columns
            lowered = [c.lower() for c in cols]
            if "item" in lowered or "shelf" in lowered:
                current_table_headers = lowered
                continue
            # Skip separator rows
            if all(set(c).issubset({"-", " ", ":"}) for c in cols if c):
                continue

        # ── Table data rows ───────────────────────────────────────────────────
        if not line.startswith("|"):
            continue

        cols = [c.strip() for c in line.split("|")[1:-1]]
        if not cols or not current_table_headers:
            continue

        try:
            if "shelf" in current_table_headers:
                # 5-column format: Shelf | Item | Category | Common Use | Confidence
                if len(cols) < 5:
                    continue
                shelf = cols[0]
                item = cols[1]
                category = cols[2]
                description = cols[3]
                confidence = cols[4]
                location = f"{main_location}, {shelf} Shelf"
            else:
                # 4-column format: Item | Category | Common Use | Confidence
                if len(cols) < 4:
                    continue
                shelf = ""
                item = cols[0]
                category = cols[1]
                description = cols[2]
                confidence = cols[3]
                location = main_location

        except IndexError:
            continue

        if not item or not category:
            continue

        if should_skip(item, confidence):
            continue

        brand, name = extract_brand_and_name(item)

        products.append({
            "name": name,
            "brand": brand,
            "category": category,
            "price": 0.00,
            "description": description,
            "in_stock": 1,
            "location": location,
            "image_url": "",
        })

    return products


# ---------------------------------------------------------------------------
# Image fetching via Open Beauty Facts (free, no key required)
# ---------------------------------------------------------------------------

def load_image_cache():
    if os.path.exists(IMG_CACHE):
        with open(IMG_CACHE, "r") as f:
            return json.load(f)
    return {}


def save_image_cache(cache):
    with open(IMG_CACHE, "w") as f:
        json.dump(cache, f, indent=2)


def fetch_image_url(name, brand, cache):
    """Search Open Beauty Facts for a matching product image."""
    import urllib.request
    import urllib.parse

    key = f"{brand}|{name}"
    if key in cache:
        return cache[key]

    # Build search query — strip size/oz info for better matches
    query = re.sub(r"\b\d+(\.\d+)?\s*(oz|ml|g|lb)\b", "", name, flags=re.IGNORECASE)
    query = f"{brand} {query}".strip()[:80]
    encoded = urllib.parse.quote_plus(query)
    url = (
        f"https://world.openbeautyfacts.org/cgi/search.pl"
        f"?search_terms={encoded}&json=1&page_size=5&action=process"
    )

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "KnewBeauty/1.0"})
        with urllib.request.urlopen(req, timeout=6) as resp:
            import json as _json
            data = _json.loads(resp.read().decode("utf-8"))
            for p in data.get("products", []):
                img = (
                    p.get("image_front_url")
                    or p.get("image_url")
                    or p.get("image_front_small_url")
                )
                if img and img.startswith("http"):
                    cache[key] = img
                    return img
    except Exception:
        pass

    cache[key] = ""
    return ""


# ---------------------------------------------------------------------------
# Main import
# ---------------------------------------------------------------------------

def ensure_db(conn):
    """Create tables if they don't exist yet (mirrors app.py init_db)."""
    conn.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            brand TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            in_stock INTEGER DEFAULT 1,
            location TEXT,
            image_url TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS product_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            viewed_at TEXT NOT NULL
        )
    """)
    conn.commit()


def main():
    print(f"Parsing {MD_PATH} ...")
    products = parse_markdown(MD_PATH)
    print(f"  Found {len(products)} products in markdown\n")

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    ensure_db(conn)

    existing_before = conn.execute("SELECT COUNT(*) FROM products").fetchone()[0]
    print(f"Products already in DB: {existing_before}")

    # Build a set of existing names to avoid duplicates
    existing_names = {
        row["name"]
        for row in conn.execute("SELECT name FROM products").fetchall()
    }

    image_cache = load_image_cache() if FETCH_IMAGES else {}
    imported = 0
    skipped = 0
    images_found = 0

    for i, p in enumerate(products):
        if p["name"] in existing_names:
            skipped += 1
            continue

        if FETCH_IMAGES:
            img = fetch_image_url(p["name"], p["brand"], image_cache)
            p["image_url"] = img
            if img:
                images_found += 1
            if i % 10 == 0:
                save_image_cache(image_cache)
            time.sleep(0.3)  # be polite to the free API

        conn.execute(
            "INSERT INTO products "
            "(name, brand, category, price, description, in_stock, location, image_url) "
            "VALUES (?,?,?,?,?,?,?,?)",
            (
                p["name"], p["brand"], p["category"], p["price"],
                p["description"], p["in_stock"], p["location"], p["image_url"],
            ),
        )
        existing_names.add(p["name"])
        imported += 1

        if imported % 100 == 0:
            conn.commit()
            print(f"  ... {imported} inserted so far")

    conn.commit()
    if FETCH_IMAGES:
        save_image_cache(image_cache)
    conn.close()

    total = existing_before + imported
    print(f"\nDone!")
    print(f"  Inserted : {imported}")
    print(f"  Skipped  : {skipped} (already in DB)")
    print(f"  Total now: {total}")
    if FETCH_IMAGES:
        print(f"  Images   : {images_found} / {imported} found")


if __name__ == "__main__":
    main()
