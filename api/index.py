import sys, os

# Make backend importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Vercel filesystem is read-only except /tmp
os.environ.setdefault('DB_PATH', '/tmp/beauty_store.db')
os.environ.setdefault('SEED_PATH', os.path.join(os.path.dirname(__file__), '..', 'backend', 'products_seed.json'))

from app import app
