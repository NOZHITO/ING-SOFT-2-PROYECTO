import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/auth/login", {
        email,
        password,
      });

      // ✅ Corregido: el backend devuelve "access_token"
      if (res.data && res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        navigate("/dashboard");
      } else {
        setError("Error: respuesta del servidor inválida.");
      }
    } catch (err) {
      console.error("Error en login:", err);
      if (err.response?.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión. Inténtalo nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-indigo-700 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Correo</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          {error && (
            <p className="text-red-400 text-center mt-2 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full py-2 rounded-lg font-medium text-white transition ${
              loading
                ? "bg-indigo-500/50 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:underline hover:text-indigo-300"
          >
            Crear cuenta
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
