import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

function Resumen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [metodoPago, setMetodoPago] = useState(null);
  const [confirmado, setConfirmado] = useState(false);

  if (!state) return <p className="text-center mt-10">No hay actividades seleccionadas.</p>;

  const { actividades, total, empresa } = state;

  const handlePagar = () => {
    setConfirmado(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto p-8">

        {!confirmado ? (
          <>
            <div className="bg-white rounded-2xl p-6 shadow mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-1">📋 Tu selección</h1>
              <p className="text-gray-400 mb-4">{empresa}</p>

              {actividades.map((a) => (
                <div key={a.id} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div>
                    <p className="font-semibold text-gray-700">✅ {a.nombre}</p>
                    <p className="text-sm text-gray-400">🕐 {a.hora_inicio} - {a.hora_fin}</p>
                  </div>
                  <p className="text-orange-500 font-bold">${a.costo}</p>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <p className="text-xl font-bold text-gray-800">Total</p>
                <p className="text-2xl font-bold text-orange-500">${total}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-700 mb-4">¿Cómo quieres pagar?</h2>

            <div className="flex flex-col gap-4 mb-6">
              <button
                onClick={() => setMetodoPago("llegando")}
                className={`p-4 rounded-2xl border-2 text-left transition ${
                  metodoPago === "llegando"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="text-lg font-bold">💵 Pagar al llegar</p>
                <p className="text-sm text-gray-500">Paga en efectivo cuando llegues al destino</p>
              </button>

              <button
                onClick={() => setMetodoPago("tarjeta")}
                className={`p-4 rounded-2xl border-2 text-left transition ${
                  metodoPago === "tarjeta"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="text-lg font-bold">💳 Pagar con tarjeta</p>
                <p className="text-sm text-gray-500">Pago seguro en línea</p>
              </button>
            </div>

            {metodoPago === "tarjeta" && (
              <div className="bg-white rounded-2xl p-6 shadow mb-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Datos de tarjeta</h3>
                <input placeholder="Nombre en la tarjeta" className="w-full border rounded-lg p-3 mb-3 outline-none focus:ring-2 focus:ring-orange-400" />
                <input placeholder="Número de tarjeta" className="w-full border rounded-lg p-3 mb-3 outline-none focus:ring-2 focus:ring-orange-400" />
                <div className="flex gap-4">
                  <input placeholder="MM/AA" className="w-1/2 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-400" />
                  <input placeholder="CVV" className="w-1/2 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
            )}

            {metodoPago && (
              <Button text="Confirmar reserva ✓" onClick={handlePagar} />
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow text-center">
            <p className="text-6xl mb-4">🎉</p>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Reserva confirmada!</h1>
            <p className="text-gray-500 mb-2">Tu reserva en <strong>{empresa}</strong> fue exitosa.</p>
            <p className="text-gray-400 mb-6">
              {metodoPago === "llegando"
                ? "Recuerda llevar efectivo cuando llegues al destino."
                : "Tu pago fue procesado correctamente."}
            </p>
            <Button text="Volver al inicio" onClick={() => navigate("/dashboard")} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Resumen;