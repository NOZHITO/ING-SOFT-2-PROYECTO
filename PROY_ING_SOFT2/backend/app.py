from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from extensions import db
from config import Settings
from routes.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Settings)

    # Inicializaciones
    CORS(app)
    db.init_app(app)
    JWTManager(app)

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # Crear tablas de base de datos al iniciar la app
    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
