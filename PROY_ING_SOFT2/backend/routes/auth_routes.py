from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User
from extensions import db  # 👈 Ya no importamos app, sino la extensión

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or not all(k in data for k in ("name", "email", "password")):
        return jsonify({"error": "Faltan campos"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email ya registrado"}), 409

    hashed_pw = generate_password_hash(data["password"])
    new_user = User(name=data["name"], email=data["email"], password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario creado"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not check_password_hash(user.password, data.get("password", "")):
        return jsonify({"error": "Credenciales inválidas"}), 401

    token = create_access_token(identity=user.id)
    return jsonify({
        "token": token,
        "user": {"id": user.id, "name": user.name, "email": user.email}
    })


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email
    })
