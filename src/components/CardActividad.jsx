import { useState } from "react";
import iconCalendario from "../assets/caledario.png";
import iconReloj from "../assets/reloj.png";
import iconPersonas from "../assets/numeroDePersonas.png";

function CardActividad({ id, nombre, descripcion, hora_inicio, hora_fin, costo, seleccionada, onSeleccionar, deshabilitada }) {
  const [dia, setDia] = useState("");
  const [personas, setPersonas] = useState(1);

  const inputClass = "border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-teal-400 text-sm w-full bg-white text-gray-800 placeholder-gray-400";

  const dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i + 1);
    return fecha.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" });
  });

  return (
    <div
      className={`rounded-2xl p-5 shadow mb-4 border-2 transition-all duration-200 ${
        seleccionada
          ? "border-teal-400 bg-teal-50"
          : deshabilitada
          ? "border-gray-200 bg-gray-50 opacity-50"
          : "border-gray-200 bg-white hover:border-teal-300"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-800">{nombre}</h3>
        <span className="text-teal-500 font-bold text-lg">
          ${costo} <span className="text-sm text-gray-500">/ persona</span>
        </span>
      </div>

      <p className="text-gray-500 text-sm mb-3">{descripcion}</p>

      {/* Horario */}
      <div className="flex items-center gap-2 mb-4">
        <img src={iconReloj} alt="horario" className="w-5 h-5 invert opacity-70" />
        <span className="text-sm text-gray-500">{hora_inicio.substring(0, 5)} - {hora_fin.substring(0, 5)}</span>
      </div>

      {/* Selector de día */}
      <div className="mb-3">
        <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2">
          <img src={iconCalendario} alt="calendario" className="w-5 h-5" />
          Selecciona un día
        </label>
        <select value={dia} onChange={(e) => setDia(e.target.value)} className={inputClass} disabled={deshabilitada}>
          <option value="">-- Elige una fecha --</option>
          {dias.map((d, i) => (
            <option key={i} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Selector de personas */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2">
          <img src={iconPersonas} alt="personas" className="w-5 h-5" />
          Número de personas
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPersonas((p) => Math.max(1, p - 1))}
            disabled={deshabilitada}
            className="bg-gray-100 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-teal-500 hover:text-gray-800 transition"
          >−</button>
          <span className="text-lg font-bold text-gray-800">{personas}</span>
          <button
            onClick={() => setPersonas((p) => Math.min(20, p + 1))}
            disabled={deshabilitada}
            className="bg-gray-100 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-teal-500 hover:text-gray-800 transition"
          >+</button>
          <span className="text-sm text-gray-500">máx. 20</span>
        </div>
      </div>

      {/* Total y botón */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Total: <span className="text-teal-500 font-bold">${costo * personas}</span>
        </p>
        <button
          disabled={deshabilitada}
          onClick={() => onSeleccionar(id, dia, personas)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            seleccionada
              ? "bg-teal-500 text-white"
              : deshabilitada
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-teal-600 border border-teal-200 hover:bg-teal-500 hover:text-white"
          }`}
        >
          {seleccionada ? "✅ Seleccionada" : "Seleccionar"}
        </button>
      </div>
    </div>
  );
}

export default CardActividad;
