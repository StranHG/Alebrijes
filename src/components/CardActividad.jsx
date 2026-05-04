import { useState } from "react";

function CardActividad({ id, nombre, descripcion, hora_inicio, hora_fin, costo, seleccionada, onSeleccionar, deshabilitada }) {
  const [dia, setDia] = useState("");
  const [personas, setPersonas] = useState(1);

  const inputClass = "border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-orange-400 text-sm w-full";

  // Generar próximos 7 días
  const dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i + 1);
    return fecha.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" });
  });

  return (
    <div
      className={`rounded-2xl p-5 shadow mb-4 border-2 transition-all duration-200 ${
        seleccionada
          ? "border-orange-500 bg-orange-50"
          : deshabilitada
          ? "border-gray-200 bg-gray-100 opacity-50"
          : "border-gray-200 bg-white hover:border-orange-300"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-800">{nombre}</h3>
        <span className="text-orange-500 font-bold text-lg">${costo} <span className="text-sm text-gray-400">/ persona</span></span>
      </div>

      <p className="text-gray-500 text-sm mb-3">{descripcion}</p>

      <p className="text-sm text-gray-400 mb-4">🕐 {hora_inicio} - {hora_fin}</p>

      {/* Selector de día */}
      <div className="mb-3">
        <label className="text-sm font-semibold text-gray-600 mb-1 block">📅 Selecciona un día</label>
        <select
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          className={inputClass}
          disabled={deshabilitada}
        >
          <option value="">-- Elige una fecha --</option>
          {dias.map((d, i) => (
            <option key={i} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Selector de personas */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-600 mb-1 block">👥 Número de personas</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPersonas((p) => Math.max(1, p - 1))}
            disabled={deshabilitada}
            className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-orange-200 transition"
          >
            −
          </button>
          <span className="text-lg font-bold text-gray-800">{personas}</span>
          <button
            onClick={() => setPersonas((p) => Math.min(20, p + 1))}
            disabled={deshabilitada}
            className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-orange-200 transition"
          >
            +
          </button>
          <span className="text-sm text-gray-400">máx. 20</span>
        </div>
      </div>

      {/* Total y botón */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Total: <span className="text-orange-500 font-bold">${costo * personas}</span>
        </p>
        <button
          disabled={deshabilitada}
          onClick={() => onSeleccionar(id, dia, personas)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            seleccionada
              ? "bg-orange-500 text-white"
              : deshabilitada
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-orange-100"
          }`}
        >
          {seleccionada ? "✅ Seleccionada" : "Seleccionar"}
        </button>
      </div>
    </div>
  );
}

export default CardActividad;