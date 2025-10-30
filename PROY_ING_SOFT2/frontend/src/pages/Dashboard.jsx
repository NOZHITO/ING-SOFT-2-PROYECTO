import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { ThemeContext } from "../context/ThemeContext";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  // 🔹 Obtener datos del usuario
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error al obtener usuario:", err);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔹 Pantalla de carga
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="text-lg animate-pulse">Cargando datos del usuario...</p>
      </div>
    );
  }

  // 🔹 Si no hay usuario válido
  if (!user) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="mb-4 text-gray-400">Tu sesión ha expirado o no existe.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
        >
          Ir al inicio
        </button>
      </div>
    );
  }

  // 🔹 Dashboard principal
  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
      } transition-all duration-500`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 ml-[70px] md:ml-[230px] p-8 transition-all">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            ¡Hola,{" "}
            <span className="text-indigo-500 font-extrabold">
              {user.name}
            </span>{" "}
            👋!
          </h1>
          <p className="text-gray-400 mb-10">{user.email}</p>
        </motion.div>

        {/* Tarjetas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "📊 Actividad",
              desc: "Monitorea tu progreso reciente y rendimiento.",
            },
            {
              title: "🗂️ Proyectos",
              desc: "Gestiona tus proyectos y tareas activas.",
            },
            {
              title: "⚙️ Configuración",
              desc: "Personaliza tus preferencias y perfil.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`p-6 rounded-xl shadow-lg border ${
                darkMode
                  ? "bg-gray-800/80 border-gray-700 hover:border-indigo-500"
                  : "bg-white border-gray-200 hover:border-indigo-400"
              } hover:scale-[1.03] transition-all duration-300`}
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <footer
          className={`mt-16 border-t pt-6 text-center text-sm ${
            darkMode ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-600"
          }`}
        >
          <p>
            © {new Date().getFullYear()} Proyecto Integrador —{" "}
            <span className="text-indigo-500 font-medium">
              Dashboard Moderno
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
}
