import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <nav className="bg-orange-500 text-white px-8 py-4 flex justify-between items-center shadow-md">
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold tracking-wide cursor-pointer"
      >
        🐉 Alebrijes
      </h1>

      <div className="flex items-center gap-4">
        {usuario ? (
          <>
            <span className="text-sm opacity-80">Hola, {usuario.nombre}</span>
            {usuario.rol === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="bg-white text-orange-500 font-semibold px-4 py-2 rounded-lg hover:bg-orange-100 transition"
              >
                Panel Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-orange-500 font-semibold px-4 py-2 rounded-lg hover:bg-orange-100 transition"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-800 transition"
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