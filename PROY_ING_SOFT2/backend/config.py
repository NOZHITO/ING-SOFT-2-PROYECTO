import os

# Obtiene la ruta absoluta del archivo actual
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Settings:
    # Claves de seguridad
    SECRET_KEY = os.environ.get("SECRET_KEY", "supersecretkey")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "superjwtsecret")

    # Base de datos SQLite (se guarda dentro de backend/)
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
