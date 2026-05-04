import { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

function Admin() {
  const [seccion, setSeccion] = useState("inicio");

  // ── PUEBLOS ──
  const [pueblo, setPueblo] = useState({ nombre: "", descripcion: "" });
  const [pueblosRegistrados, setPueblosRegistrados] = useState([]);
  const [editandoPueblo, setEditandoPueblo] = useState(null);

  // ── EMPRESAS ──
  const [empresa, setEmpresa] = useState({
    nombre: "", direccion: "", rfc: "", telefono: "", pueblo: "",
    servicios: "", politicas: "", puntos_encuentro: ""
  });
  const [empresasRegistradas, setEmpresasRegistradas] = useState([]);
  const [editandoEmpresa, setEditandoEmpresa] = useState(null);

  // ── ACTIVIDADES ──
  const [actividad, setActividad] = useState({
    nombre: "", descripcion: "", hora_inicio: "", hora_fin: "", costo: "", empresa: ""
  });
  const [actividadesRegistradas, setActividadesRegistradas] = useState([]);
  const [editandoActividad, setEditandoActividad] = useState(null);

  // ── USUARIOS ──
  const [usuarios] = useState([
    { id: 1, nombre: "Admin", email: "admin@test.com", rol: "admin" },
    { id: 2, nombre: "Jesus", email: "jesus@test.com", rol: "usuario" },
  ]);

  const handlePueblo = () => {
    if (!pueblo.nombre || !pueblo.descripcion) return alert("⚠️ Completa todos los campos");
    setPueblosRegistrados([...pueblosRegistrados, { ...pueblo, id: Date.now() }]);
    setPueblo({ nombre: "", descripcion: "" });
    alert("✅ Pueblo registrado correctamente");
  };

  const handleEmpresa = () => {
    if (!empresa.nombre || !empresa.direccion || !empresa.rfc || !empresa.telefono || !empresa.pueblo)
      return alert("⚠️ Completa los campos obligatorios");
    setEmpresasRegistradas([...empresasRegistradas, { ...empresa, id: Date.now() }]);
    setEmpresa({ nombre: "", direccion: "", rfc: "", telefono: "", pueblo: "", servicios: "", politicas: "", puntos_encuentro: "" });
    alert("✅ Empresa registrada correctamente");
  };

  const handleActividad = () => {
    if (!actividad.nombre || !actividad.descripcion || !actividad.hora_inicio || !actividad.hora_fin || !actividad.costo || !actividad.empresa)
      return alert("⚠️ Completa todos los campos");
    setActividadesRegistradas([...actividadesRegistradas, { ...actividad, id: Date.now() }]);
    setActividad({ nombre: "", descripcion: "", hora_inicio: "", hora_fin: "", costo: "", empresa: "" });
    alert("✅ Actividad registrada correctamente");
  };

  const inputClass = "w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-orange-400 text-sm";
  const labelClass = "text-sm font-semibold text-gray-600 mb-1 block";

  const menuItems = [
    { key: "inicio", label: "🏠 Inicio" },
    { key: "pueblos", label: "🏔️ Pueblos" },
    { key: "empresas", label: "🏢 Empresas" },
    { key: "actividades", label: "🧗 Actividades" },
    { key: "usuarios", label: "👥 Usuarios" },
    { key: "reservaciones", label: "📅 Reservaciones" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">

        <h1 className="text-4xl font-bold text-gray-800 mb-1">Panel de Administrador</h1>
        <p className="text-gray-400 mb-8">Gestiona pueblos, empresas y actividades</p>

        {/* Menú */}
        <div className="flex flex-wrap gap-4 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSeccion(item.key)}
              className={`px-5 py-2 rounded-full font-semibold transition ${
                seccion === item.key
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 hover:bg-orange-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ── INICIO ── */}
        {seccion === "inicio" && (
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Pueblos registrados", count: pueblosRegistrados.length, emoji: "🏔️" },
              { label: "Empresas registradas", count: empresasRegistradas.length, emoji: "🏢" },
              { label: "Actividades registradas", count: actividadesRegistradas.length, emoji: "🧗" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-6 shadow text-center">
                <p className="text-5xl mb-2">{item.emoji}</p>
                <p className="text-4xl font-bold text-orange-500">{item.count}</p>
                <p className="text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── PUEBLOS ── */}
        {seccion === "pueblos" && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">➕ Registrar Pueblo</h2>
              <label className={labelClass}>Nombre del pueblo *</label>
              <input className={inputClass} placeholder="Ej: San Martín Tilcajete" value={pueblo.nombre} onChange={(e) => setPueblo({ ...pueblo, nombre: e.target.value })} />
              <label className={labelClass}>Descripción *</label>
              <textarea className={inputClass} placeholder="Descripción del pueblo mágico..." rows={4} value={pueblo.descripcion} onChange={(e) => setPueblo({ ...pueblo, descripcion: e.target.value })} />
              <Button text="Registrar pueblo" onClick={handlePueblo} />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">📋 Pueblos registrados ({pueblosRegistrados.length})</h2>
              {pueblosRegistrados.length === 0 ? (
                <p className="text-gray-400">Aún no hay pueblos registrados</p>
              ) : (
                pueblosRegistrados.map((p) => (
                  <div key={p.id} className="border-b py-3 last:border-0">
                    {editandoPueblo?.id === p.id ? (
                      <div>
                        <input
                          className="w-full border rounded-lg p-2 mb-2 outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                          value={editandoPueblo.nombre}
                          onChange={(e) => setEditandoPueblo({ ...editandoPueblo, nombre: e.target.value })}
                        />
                        <textarea
                          className="w-full border rounded-lg p-2 mb-2 outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                          rows={2}
                          value={editandoPueblo.descripcion}
                          onChange={(e) => setEditandoPueblo({ ...editandoPueblo, descripcion: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setPueblosRegistrados(pueblosRegistrados.map((x) => x.id === p.id ? editandoPueblo : x));
                              setEditandoPueblo(null);
                            }}
                            className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600"
                          >
                            ✅ Guardar
                          </button>
                          <button
                            onClick={() => setEditandoPueblo(null)}
                            className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-300"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-gray-700">🏔️ {p.nombre}</p>
                        <p className="text-sm text-gray-400 mb-2">{p.descripcion}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditandoPueblo(p)}
                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-200"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar "${p.nombre}"?`))
                                setPueblosRegistrados(pueblosRegistrados.filter((x) => x.id !== p.id));
                            }}
                            className="bg-red-100 text-red-500 px-3 py-1 rounded-lg text-sm hover:bg-red-200"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── EMPRESAS ── */}
        {seccion === "empresas" && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow overflow-y-auto" style={{ maxHeight: "80vh" }}>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">➕ Registrar Empresa</h2>
              <label className={labelClass}>Nombre de la empresa *</label>
              <input className={inputClass} placeholder="Ej: Tours Mazateca" value={empresa.nombre} onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })} />
              <label className={labelClass}>Dirección *</label>
              <input className={inputClass} placeholder="Ej: Calle Principal #12" value={empresa.direccion} onChange={(e) => setEmpresa({ ...empresa, direccion: e.target.value })} />
              <label className={labelClass}>RFC *</label>
              <input className={inputClass} placeholder="Ej: TMA123456ABC" value={empresa.rfc} onChange={(e) => setEmpresa({ ...empresa, rfc: e.target.value })} />
              <label className={labelClass}>Teléfono *</label>
              <input className={inputClass} placeholder="Ej: 951 123 4567" value={empresa.telefono} onChange={(e) => setEmpresa({ ...empresa, telefono: e.target.value })} />
              <label className={labelClass}>Pueblo al que pertenece *</label>
              <select className={inputClass} value={empresa.pueblo} onChange={(e) => setEmpresa({ ...empresa, pueblo: e.target.value })}>
                <option value="">-- Selecciona un pueblo --</option>
                {pueblosRegistrados.map((p) => (
                  <option key={p.id} value={p.nombre}>{p.nombre}</option>
                ))}
              </select>
              {pueblosRegistrados.length === 0 && (
                <p className="text-orange-500 text-xs mb-4">⚠️ Primero registra un pueblo mágico</p>
              )}
              <label className={labelClass}>Servicios incluidos</label>
              <textarea className={inputClass} placeholder="Transporte, Almuerzo típico, Guía certificado (uno por línea)" rows={3} value={empresa.servicios} onChange={(e) => setEmpresa({ ...empresa, servicios: e.target.value })} />
              <label className={labelClass}>Políticas de cancelación</label>
              <textarea className={inputClass} placeholder="Cancelación gratuita 48 horas antes (una por línea)" rows={3} value={empresa.politicas} onChange={(e) => setEmpresa({ ...empresa, politicas: e.target.value })} />
              <label className={labelClass}>Puntos de encuentro</label>
              <textarea className={inputClass} placeholder="Plaza Central - 8:30 AM (uno por línea)" rows={3} value={empresa.puntos_encuentro} onChange={(e) => setEmpresa({ ...empresa, puntos_encuentro: e.target.value })} />
              <Button text="Registrar empresa" onClick={handleEmpresa} />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow overflow-y-auto" style={{ maxHeight: "80vh" }}>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">📋 Empresas registradas ({empresasRegistradas.length})</h2>
              {empresasRegistradas.length === 0 ? (
                <p className="text-gray-400">Aún no hay empresas registradas</p>
              ) : (
                empresasRegistradas.map((e) => (
                  <div key={e.id} className="border-b py-3 last:border-0">
                    {editandoEmpresa?.id === e.id ? (
                      <div>
                        <input className="w-full border rounded-lg p-2 mb-2 text-sm outline-none focus:ring-2 focus:ring-orange-400" value={editandoEmpresa.nombre} onChange={(x) => setEditandoEmpresa({ ...editandoEmpresa, nombre: x.target.value })} />
                        <input className="w-full border rounded-lg p-2 mb-2 text-sm outline-none focus:ring-2 focus:ring-orange-400" value={editandoEmpresa.direccion} onChange={(x) => setEditandoEmpresa({ ...editandoEmpresa, direccion: x.target.value })} />
                        <input className="w-full border rounded-lg p-2 mb-2 text-sm outline-none focus:ring-2 focus:ring-orange-400" value={editandoEmpresa.telefono} onChange={(x) => setEditandoEmpresa({ ...editandoEmpresa, telefono: x.target.value })} />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => { setEmpresasRegistradas(empresasRegistradas.map((x) => x.id === e.id ? editandoEmpresa : x)); setEditandoEmpresa(null); }} className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm">✅ Guardar</button>
                          <button onClick={() => setEditandoEmpresa(null)} className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-gray-700">🏢 {e.nombre}</p>
                        <p className="text-sm text-gray-400">📍 {e.direccion}</p>
                        <p className="text-sm text-gray-400">📞 {e.telefono}</p>
                        <p className="text-sm text-orange-500 mb-2">Pueblo: {e.pueblo}</p>
                        <div className="flex gap-2">
                          <button onClick={() => setEditandoEmpresa(e)} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-200">✏️ Editar</button>
                          <button onClick={() => { if (confirm(`¿Eliminar "${e.nombre}"?`)) setEmpresasRegistradas(empresasRegistradas.filter((x) => x.id !== e.id)); }} className="bg-red-100 text-red-500 px-3 py-1 rounded-lg text-sm hover:bg-red-200">🗑️ Eliminar</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── ACTIVIDADES ── */}
        {seccion === "actividades" && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">➕ Registrar Actividad</h2>
              <label className={labelClass}>Nombre de la actividad *</label>
              <input className={inputClass} placeholder="Ej: Caminata al cerro sagrado" value={actividad.nombre} onChange={(e) => setActividad({ ...actividad, nombre: e.target.value })} />
              <label className={labelClass}>Descripción *</label>
              <textarea className={inputClass} placeholder="Describe la actividad..." rows={3} value={actividad.descripcion} onChange={(e) => setActividad({ ...actividad, descripcion: e.target.value })} />
              <label className={labelClass}>Hora de inicio *</label>
              <input className={inputClass} type="time" value={actividad.hora_inicio} onChange={(e) => setActividad({ ...actividad, hora_inicio: e.target.value })} />
              <label className={labelClass}>Hora de fin *</label>
              <input className={inputClass} type="time" value={actividad.hora_fin} onChange={(e) => setActividad({ ...actividad, hora_fin: e.target.value })} />
              <label className={labelClass}>Costo por persona ($) *</label>
              <input className={inputClass} type="number" placeholder="Ej: 350" value={actividad.costo} onChange={(e) => setActividad({ ...actividad, costo: e.target.value })} />
              <label className={labelClass}>Empresa a la que pertenece *</label>
              <select className={inputClass} value={actividad.empresa} onChange={(e) => setActividad({ ...actividad, empresa: e.target.value })}>
                <option value="">-- Selecciona una empresa --</option>
                {empresasRegistradas.map((e) => (
                  <option key={e.id} value={e.nombre}>{e.nombre}</option>
                ))}
              </select>
              {empresasRegistradas.length === 0 && (
                <p className="text-orange-500 text-xs mb-4">⚠️ Primero registra una empresa</p>
              )}
              <Button text="Registrar actividad" onClick={handleActividad} />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">📋 Actividades registradas ({actividadesRegistradas.length})</h2>
              {actividadesRegistradas.length === 0 ? (
                <p className="text-gray-400">Aún no hay actividades registradas</p>
              ) : (
                actividadesRegistradas.map((a) => (
                  <div key={a.id} className="border-b py-3 last:border-0">
                    {editandoActividad?.id === a.id ? (
                      <div>
                        <input className="w-full border rounded-lg p-2 mb-2 text-sm outline-none focus:ring-2 focus:ring-orange-400" value={editandoActividad.nombre} onChange={(e) => setEditandoActividad({ ...editandoActividad, nombre: e.target.value })} />
                        <input className="w-full border rounded-lg p-2 mb-2 text-sm outline-none focus:ring-2 focus:ring-orange-400" type="time" value={editandoActividad.hora_inicio} onChange={(e) => setEditandoActividad({ ...editandoActividad, hora_inicio: e.target.value })} />
                        <input className="w-full border rounded-lg p-2 mb-2 text-sm outline-none focus:ring-2 focus:ring-orange-400" type="time" value={editandoActividad.hora_fin} onChange={(e) => setEditandoActividad({ ...editandoActividad, hora_fin: e.target.value })} />
                        <input className="w-full border rounded-lg p-2 mb-2 text-sm outline-none focus:ring-2 focus:ring-orange-400" type="number" value={editandoActividad.costo} onChange={(e) => setEditandoActividad({ ...editandoActividad, costo: e.target.value })} />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => { setActividadesRegistradas(actividadesRegistradas.map((x) => x.id === a.id ? editandoActividad : x)); setEditandoActividad(null); }} className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm">✅ Guardar</button>
                          <button onClick={() => setEditandoActividad(null)} className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-gray-700">🧗 {a.nombre}</p>
                        <p className="text-sm text-gray-400">🕐 {a.hora_inicio} - {a.hora_fin}</p>
                        <p className="text-sm text-gray-400">💰 ${a.costo} por persona</p>
                        <p className="text-sm text-orange-500 mb-2">{a.empresa}</p>
                        <div className="flex gap-2">
                          <button onClick={() => setEditandoActividad(a)} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-200">✏️ Editar</button>
                          <button onClick={() => { if (confirm(`¿Eliminar "${a.nombre}"?`)) setActividadesRegistradas(actividadesRegistradas.filter((x) => x.id !== a.id)); }} className="bg-red-100 text-red-500 px-3 py-1 rounded-lg text-sm hover:bg-red-200">🗑️ Eliminar</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── USUARIOS ── */}
        {seccion === "usuarios" && (
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">👥 Usuarios registrados</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-orange-50 text-left">
                  <th className="p-3 rounded-l-lg">Nombre</th>
                  <th className="p-3">Email</th>
                  <th className="p-3 rounded-r-lg">Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="p-3 font-semibold text-gray-700">{u.nombre}</td>
                    <td className="p-3 text-gray-500">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.rol === "admin" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"}`}>
                        {u.rol}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── RESERVACIONES ── */}
        {seccion === "reservaciones" && (
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">📅 Reservaciones</h2>
            <div className="text-center py-12">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-gray-400">Las reservaciones aparecerán aquí cuando se conecte la base de datos.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;