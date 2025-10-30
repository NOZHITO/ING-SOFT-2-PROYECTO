from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from datetime import timedelta
from extensions import db
from models import User

auth_bp = Blueprint("auth_bp", __name__)

# -----------------------------
# 🔹 REGISTRO DE USUARIO
# -----------------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        return jsonify({"msg": "Faltan datos"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"msg": "El usuario ya existe"}), 400

    hashed_password = generate_password_hash(password)
    user = User(name=name, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado correctamente"}), 201


# -----------------------------
# 🔹 LOGIN DE USUARIO
# -----------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y contraseña requeridos"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    access_token = create_access_token(
        identity=str(user.id),  # ⚠️ Convertimos a str para evitar errores con JWT
        expires_delta=timedelta(hours=1)
    )

    return jsonify(access_token=access_token), 200


# -----------------------------
# 🔹 RUTA PROTEGIDA (INFO DE USUARIO)
# -----------------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()  # ← Este devuelve el ID del token
    print("🧩 ID desde token:", user_id)

    # Convertimos a int si fuera necesario
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"msg": "Token inválido"}), 422

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email
    }), 200
