import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import ModalLogin from "../components/ModalLogin";
import iconTelefono from "../assets/telefono.png";
import iconUbicacion from "../assets/puntoDeEncuentro.png";
import iconPersonas from "../assets/numeroDePersonas.png";
import iconCalendario from "../assets/caledario.png";
import iconReloj from "../assets/reloj.png";

function Empresa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [itinerarios, setItinerarios] = useState([]);
  const [personas, setPersonas] = useState(1);
  const [dia, setDia] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(true);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    Promise.all([
      fetch("http://localhost/alebrijes/empresas.php").then((r) => r.json()).catch(() => null),
      fetch(`http://localhost/alebrijes/itinerarios.php?empresa_id=${id}`).then((r) => r.json()).catch(() => null),
    ]).then(([empData, itData]) => {
      if (empData?.success) {
        const encontrada = empData.empresas.find((e) => String(e.id) === String(id));
        setEmpresa(encontrada || null);
      }
      if (itData?.success) setItinerarios(itData.itinerarios);
      setCargando(false);
    });
  }, [id]);

  const handleReservar = (itinerario) => {
    if (!usuario) { setMostrarModal(true); return; }
    if (!dia) { alert("⚠️ Selecciona una fecha"); return; }
    navigate("/resumen", {
      state: {
        paquete: true,
        empresa: empresa.nombre,
        empresa_id: empresa.id,
        empresa_direccion: empresa.direccion,
        empresa_telefono: empresa.telefono,
        itinerario_nombre: itinerario.nombre,
        itinerario_actividades: itinerario.actividades,
        precio_paquete: Number(itinerario.precio),
        personas,
        dia,
        total: Number(itinerario.precio) * personas,
      },
    });
  };

  if (cargando) return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="text-center py-16">
        <p className="text-5xl mb-4">⏳</p>
        <p className="text-gray-600 text-xl">Cargando...</p>
      </div>
    </div>
  );

  if (!empresa) return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <p className="text-center mt-10 text-gray-600">Empresa no encontrada.</p>
    </div>
  );

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">

        {/* Info empresa */}
        <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-teal-500 mb-4">{empresa.nombre}</h1>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src={iconUbicacion} alt="ubicación" className="w-5 h-5" />
              <p className="text-gray-600">{empresa.direccion}</p>
            </div>
            <div className="flex items-center gap-2">
              <img src={iconTelefono} alt="teléfono" className="w-5 h-5" />
              <p className="text-gray-600">{empresa.telefono}</p>
            </div>
          </div>
        </div>

        {/* Selector de fecha y personas (global, aplica a todos los paquetes) */}
        <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-5 mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-3">¿Cuándo y con cuántas personas?</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <img src={iconCalendario} alt="fecha" className="w-4 h-4" />
                Fecha del tour
              </label>
              <input
                type="date"
                min={hoy}
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 bg-white text-sm"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <img src={iconPersonas} alt="personas" className="w-4 h-4" />
                Personas
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={personas}
                onChange={(e) => setPersonas(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 bg-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Paquetes / itinerarios */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Paquetes disponibles</h2>

        {itinerarios.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-gray-400">Los paquetes de esta empresa estarán disponibles pronto</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {itinerarios.map((it) => {
              const precio = Number(it.precio);
              const total = precio * personas;
              return (
                <div key={it.id} className="bg-white border border-teal-100 shadow-sm rounded-2xl overflow-hidden">
                  {/* Header del paquete */}
                  <div className="bg-teal-500 px-6 py-4 text-white">
                    <p className="text-lg font-bold">{it.nombre}</p>
                    <p className="text-teal-100 text-sm">
                      ${precio.toLocaleString("es-MX")} / persona
                    </p>
                  </div>

                  {/* Itinerario de actividades */}
                  {it.actividades.length > 0 && (
                    <div className="px-6 py-4 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Itinerario</p>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-teal-100" />
                        {it.actividades.map((a) => (
                          <div key={a.id} className="flex gap-3 mb-3 last:mb-0">
                            <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
                              {a.hora_inicio.substring(0, 5)}
                            </div>
                            <div className="flex-1 pt-1">
                              <p className="text-sm font-semibold text-gray-800">{a.nombre}</p>
                              {a.descripcion && <p className="text-xs text-gray-500 mt-0.5">{a.descripcion}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total + botón reservar */}
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">
                        ${precio.toLocaleString("es-MX")} × {personas} persona{personas !== 1 ? "s" : ""}
                      </p>
                      <p className="text-2xl font-bold text-teal-500">
                        ${total.toLocaleString("es-MX")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleReservar(it)}
                      className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm"
                    >
                      Reservar →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6">
          <Button text="← Regresar" onClick={() => navigate(-1)} variant="ghost" fullWidth={false} />
        </div>

        {mostrarModal && <ModalLogin onCerrar={() => setMostrarModal(false)} />}
      </div>
    </div>
  );
}

export default Empresa;
