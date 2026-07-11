import sys, os

# Add backend to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Vercel: use /tmp for writable SQLite, seed from local copy
os.environ.setdefault('DB_PATH',   '/tmp/beauty_store.db')
os.environ.setdefault('SEED_PATH', os.path.join(os.path.dirname(__file__), 'products_seed.json'))

from app import app
