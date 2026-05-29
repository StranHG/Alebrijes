import { useNavigate } from "react-router-dom";
import fondoNav from "../assets/log.jpg";

function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <nav
      className="relative text-white px-8 py-4 flex justify-between items-center shadow-lg overflow-hidden"
      style={{ backgroundImage: `url(${fondoNav})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div
        onClick={() => navigate("/")}
        className="relative z-10 cursor-pointer"
      >
        <h1 className="text-2xl font-bold tracking-wide text-teal-400">Alebrijes</h1>
      </div>

      <div className="relative z-10 flex items-center gap-4">
        {usuario ? (
          <>
            <button
              onClick={() => navigate("/perfil")}
              className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition backdrop-blur-sm"
            >
              <span className="w-6 h-6 rounded-full bg-teal-400 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {usuario.nombre.charAt(0).toUpperCase()}
              </span>
              {usuario.nombre.split(" ")[0]}
            </button>
            {usuario.rol === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition"
              >
                Panel Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-white/10 border border-white/30 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition backdrop-blur-sm"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white/10 border border-white/30 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition backdrop-blur-sm"
            >
              Registrarse
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
