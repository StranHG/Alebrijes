import { useNavigate } from "react-router-dom";

function ModalLogin({ onCerrar }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
        <p className="text-5xl mb-4">🐉</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Únete a Alebrijes!</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Para reservar actividades necesitas una cuenta. Es gratis y solo toma un minuto.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition mb-3"
        >
          Crear cuenta gratis
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition mb-4"
        >
          Ya tengo cuenta
        </button>

        <button
          onClick={onCerrar}
          className="text-sm text-gray-400 hover:text-gray-600 transition"
        >
          Seguir explorando
        </button>
      </div>
    </div>
  );
}

export default ModalLogin;