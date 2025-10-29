from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import settings
from extensions import db
import os
import sys

# ==========================================
# 🔹 Configuración de entorno
# ==========================================
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

# ==========================================
# 🔹 Creación de la app Flask
# ==========================================
def create_app():
    app = Flask(__name__)
    app.config.from_object(settings)

    # Extensiones
    CORS(app)
    db.init_app(app)
    JWTManager(app)

    # Rutas
    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.route("/health")
    def health():
        return jsonify({"status": "ok"})

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
