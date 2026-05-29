import { useNavigate } from "react-router-dom";
import iconAlebrije from "../assets/alebrije.png";
import Navbar from "../components/Navbar";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
        <img src={iconAlebrije} alt="alebrije" className="w-24 h-24 mb-6 opacity-30" />
        <p className="text-8xl font-bold text-teal-500 mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Página no encontrada</h1>
        <p className="text-gray-400 mb-8 max-w-sm">La página que buscas no existe o fue movida.</p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:from-teal-600 hover:to-teal-700 transition-all duration-150 active:scale-95"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default NotFound;
