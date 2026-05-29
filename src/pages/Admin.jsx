import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import iconInicio from "../assets/Inicio.png";
import iconPueblo from "../assets/pueblo.png";
import iconEmpresa from "../assets/empresa.png";
import iconActividades from "../assets/actividades.png";
import iconReservaciones from "../assets/reservaciones.png";
import iconReloj from "../assets/reloj.png";
import iconCalendario from "../assets/caledario.png";
import iconPersonas from "../assets/numeroDePersonas.png";
import iconTelefono from "../assets/telefono.png";
import iconUbicacion from "../assets/puntoDeEncuentro.png";
import iconTarjeta from "../assets/tarjeta-bancaria.png";
import iconEfectivo from "../assets/efectivo.png";
import iconAlebrije from "../assets/alebrije.png";

function Admin() {
  const [seccion, setSeccion] = useState("inicio");

  // ── PUEBLOS ──
  const [pueblo, setPueblo] = useState({ nombre: "", descripcion: "", imagen_url: "" });
  const [pueblosRegistrados, setPueblosRegistrados] = useState([]);
  const [editandoPueblo, setEditandoPueblo] = useState(null);
  const [previewImagenes, setPreviewImagenes] = useState([]);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  // ── EMPRESAS ──
  const [empresa, setEmpresa] = useState({
    nombre: "", direccion: "", rfc: "", telefono: "", pueblo_id: ""
  });
  const [empresasRegistradas, setEmpresasRegistradas] = useState([]);
  const [editandoEmpresa, setEditandoEmpresa] = useState(null);

  // ── ACTIVIDADES / ITINERARIOS ──
  const [actividad, setActividad] = useState({
    nombre: "", descripcion: "", hora_inicio: "", empresa_id: ""
  });
  const [itinerariosRegistrados, setItinerariosRegistrados] = useState([]);
  const [pendingActividades, setPendingActividades] = useState([]);
  const [showSaveItinerario, setShowSaveItinerario] = useState(false);
  const [itinerarioForm, setItinerarioForm] = useState({ nombre: "", precio: "" });

  // ── USUARIOS ──
  const [usuarios, setUsuarios] = useState([]);

  // ── RESERVACIONES ──
  const [reservaciones, setReservaciones] = useState([]);

  // ── FILTRO ITINERARIOS (panel derecho actividades) ──
  const [filtroEmpresa, setFiltroEmpresa] = useState("");

  // ── ERRORES DE VALIDACIÓN ──
  const [erroresEmpresa, setErroresEmpresa] = useState({});
  const [erroresActividad, setErroresActividad] = useState({});

  useEffect(() => {
    cargarPueblos();
    cargarEmpresas();
    cargarItinerarios();
    cargarUsuarios();
    cargarReservaciones();
  }, []);

  const cargarPueblos = async () => {
    const res = await fetch("http://localhost/alebrijes/pueblos.php");
    const data = await res.json();
    if (data.success) setPueblosRegistrados(data.pueblos);
  };

  const cargarEmpresas = async () => {
    const res = await fetch("http://localhost/alebrijes/empresas.php");
    const data = await res.json();
    if (data.success) setEmpresasRegistradas(data.empresas);
  };

  const cargarItinerarios = async () => {
    const res = await fetch("http://localhost/alebrijes/itinerarios.php");
    const data = await res.json();
    if (data.success) setItinerariosRegistrados(data.itinerarios);
  };

  const cargarUsuarios = async () => {
    const res = await fetch("http://localhost/alebrijes/usuarios.php");
    const data = await res.json();
    if (data.success) setUsuarios(data.usuarios);
  };

  const cargarReservaciones = async () => {
    const res = await fetch("http://localhost/alebrijes/reservaciones.php");
    const data = await res.json();
    if (data.success) setReservaciones(data.reservaciones);
  };

  const handlePueblo = async () => {
    if (!pueblo.nombre || !pueblo.descripcion) return alert("⚠️ Completa los campos obligatorios");
    const res = await fetch("http://localhost/alebrijes/pueblos.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pueblo),
    });
    const data = await res.json();
    if (data.success) {
      cargarPueblos();
      setPueblo({ nombre: "", descripcion: "", imagen_url: "" });
      setPreviewImagenes([]);
      alert("Pueblo registrado correctamente");
    } else alert(" Error al registrar");
  };

  const validarEmpresa = () => {
    const errs = {};
    if (!empresa.nombre.trim() || empresa.nombre.trim().length < 3)
      errs.nombre = "El nombre debe tener al menos 3 caracteres";
    if (!empresa.direccion.trim() || empresa.direccion.trim().length < 5)
      errs.direccion = "Ingresa una dirección válida (mín. 5 caracteres)";
    if (!/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/i.test(empresa.rfc.trim()))
      errs.rfc = "RFC inválido. Ej: ABC123456XY1 (12 caracteres)";
    if (!/^\d{10}$/.test(empresa.telefono.trim()))
      errs.telefono = "Teléfono debe tener exactamente 10 dígitos";
    if (!empresa.pueblo_id)
      errs.pueblo_id = "Selecciona un pueblo";
    setErroresEmpresa(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEmpresa = async () => {
    if (!validarEmpresa()) return;
    const res = await fetch("http://localhost/alebrijes/empresas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empresa),
    });
    const data = await res.json();
    if (data.success) {
      cargarEmpresas();
      setEmpresa({ nombre: "", direccion: "", rfc: "", telefono: "", pueblo_id: "" });
      setErroresEmpresa({});
      alert(" Empresa registrada correctamente");
    } else alert(" Error al registrar");
  };

  const validarActividad = () => {
    const errs = {};
    if (!actividad.nombre.trim() || actividad.nombre.trim().length < 3)
      errs.nombre = "El nombre debe tener al menos 3 caracteres";
    if (!actividad.hora_inicio)
      errs.hora_inicio = "Ingresa la hora";
    if (!actividad.empresa_id)
      errs.empresa_id = "Selecciona una empresa";
    setErroresActividad(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddPending = () => {
    if (!validarActividad()) return;
    setPendingActividades((prev) => [
      ...prev,
      { id: Date.now(), nombre: actividad.nombre, descripcion: actividad.descripcion, hora_inicio: actividad.hora_inicio },
    ]);
    setActividad((prev) => ({ ...prev, nombre: "", descripcion: "", hora_inicio: "" }));
    setErroresActividad({});
  };

  const handleGuardarItinerario = async () => {
    if (!itinerarioForm.precio) { alert("Ingresa el precio del paquete"); return; }
    const res = await fetch("http://localhost/alebrijes/itinerarios.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa_id: actividad.empresa_id,
        nombre: itinerarioForm.nombre || "Paquete",
        precio: itinerarioForm.precio,
        actividades: pendingActividades,
      }),
    });
    const data = await res.json();
    if (data.success) {
      cargarItinerarios();
      setPendingActividades([]);
      setShowSaveItinerario(false);
      setItinerarioForm({ nombre: "", precio: "" });
    } else alert("Error al guardar el itinerario");
  };

  const handleEliminarItinerario = async (id, nombre) => {
    if (!confirm(`¿Eliminar el itinerario "${nombre}"? Se eliminarán todas sus actividades.`)) return;
    const res = await fetch("http://localhost/alebrijes/itinerarios.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) cargarItinerarios();
  };

  const handleEliminarPueblo = async (id, nombre) => {
    if (!confirm(`¿Eliminar el pueblo "${nombre}"?`)) return;
    const res = await fetch("http://localhost/alebrijes/pueblos.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) cargarPueblos();
    else alert(`⚠️ ${data.mensaje || "Error al eliminar"}`);
  };

  const handleEliminarEmpresa = async (id, nombre) => {
    if (!confirm(`¿Eliminar la empresa "${nombre}"? Se eliminarán también sus itinerarios y actividades.`)) return;
    const res = await fetch("http://localhost/alebrijes/empresas.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) { cargarEmpresas(); cargarItinerarios(); }
    else alert(`⚠️ ${data.mensaje || "Error al eliminar"}`);
  };


  const handleSubirImagenes = async (files) => {
    if (!files.length) return;
    setSubiendoImagen(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("imagenes[]", f));
      const res = await fetch("http://localhost/alebrijes/upload.php", { method: "POST", body: formData });
      const text = await res.text();
      const data = JSON.parse(text);
      if (data.success) {
        const actuales = JSON.parse(pueblo.imagen_url || "[]");
        const nuevas = [...actuales, ...data.urls];
        setPueblo((prev) => ({ ...prev, imagen_url: JSON.stringify(nuevas) }));
        setPreviewImagenes(nuevas);
      } else alert(" Error: " + data.mensaje);
    } catch (e) {
      console.error("Error upload:", e);
      alert(" Error de conexión con el servidor");
    }
    setSubiendoImagen(false);
  };

  const handleQuitarImagen = (index) => {
    const nuevas = previewImagenes.filter((_, i) => i !== index);
    setPreviewImagenes(nuevas);
    setPueblo((prev) => ({ ...prev, imagen_url: JSON.stringify(nuevas) }));
  };

  const handleGuardarPueblo = async () => {
    const res = await fetch("http://localhost/alebrijes/pueblos.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editandoPueblo),
    });
    const data = await res.json();
    if (data.success) { cargarPueblos(); setEditandoPueblo(null); }
  };

  const handleGuardarEmpresa = async () => {
    const res = await fetch("http://localhost/alebrijes/empresas.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editandoEmpresa),
    });
    const data = await res.json();
    if (data.success) { cargarEmpresas(); setEditandoEmpresa(null); }
  };


  const inputClass = "w-full border border-gray-200 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-teal-400 text-sm bg-white text-gray-800 placeholder-gray-400";
  const inputEditClass = "w-full border border-gray-200 rounded-lg p-2 mb-2 outline-none focus:ring-2 focus:ring-teal-400 text-sm bg-white text-gray-800";
  const labelClass = "text-sm font-semibold text-gray-600 mb-1 block";

  const menuItems = [
    { key: "inicio",       label: "Inicio",        icon: iconInicio },
    { key: "pueblos",      label: "Pueblos",        icon: iconPueblo },
    { key: "empresas",     label: "Empresas",       icon: iconEmpresa },
    { key: "actividades",  label: "Actividades",    icon: iconActividades },
    { key: "usuarios",     label: "Usuarios",       icon: iconActividades },
    { key: "reservaciones",label: "Reservaciones",  icon: iconReservaciones },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">

        <h1 className="text-4xl font-bold text-teal-500 mb-1">Panel de Administrador</h1>
        <p className="text-gray-400 mb-8">Gestiona pueblos, empresas y actividades</p>

        {/* Menú */}
        <div className="flex flex-wrap gap-3 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSeccion(item.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition ${
                seccion === item.key
                  ? "bg-teal-500 text-gray-800"
                  : "bg-white text-gray-400 border border-gray-200 hover:border-teal-500 hover:text-teal-500"
              }`}
            >
              <img src={item.icon} alt={item.label} className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* ── INICIO ── */}
        {seccion === "inicio" && (
          <div className="flex flex-col gap-6">

            {/* Bienvenida */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-teal-100 text-sm mb-1">Bienvenido de nuevo</p>
                <h2 className="text-2xl font-bold text-white">
                  {JSON.parse(localStorage.getItem("usuario"))?.nombre || "Administrador"}
                </h2>
                <p className="text-teal-100 text-xs mt-1">
                  {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <img src={iconAlebrije} alt="alebrije" className="w-16 h-16 opacity-80 drop-shadow-lg" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Pueblos",       count: pueblosRegistrados.length,     icon: iconPueblo,        color: "bg-teal-50 text-teal-500" },
                { label: "Empresas",      count: empresasRegistradas.length,    icon: iconEmpresa,       color: "bg-teal-50 text-teal-500" },
                { label: "Itinerarios",   count: itinerariosRegistrados.length, icon: iconActividades,   color: "bg-teal-50 text-teal-500" },
                { label: "Reservaciones", count: reservaciones.length,          icon: iconReservaciones, color: "bg-teal-50 text-teal-500" },
              ].map(({ label, count, icon, color }) => (
                <div key={label} className="bg-white border border-teal-100 shadow-sm rounded-2xl p-5 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <img src={icon} alt={label} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-teal-500 leading-none">{count}</p>
                    <p className="text-xs text-gray-400 mt-1">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Últimas reservaciones */}
            <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Últimas reservaciones</h3>
                <button
                  onClick={() => setSeccion("reservaciones")}
                  className="text-xs text-teal-500 font-semibold hover:underline"
                >
                  Ver todas →
                </button>
              </div>
              {reservaciones.length === 0 ? (
                <div className="text-center py-8">
                  <img src={iconReservaciones} alt="sin reservaciones" className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-gray-400 text-sm">Aún no hay reservaciones</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-gray-100">
                  {reservaciones.slice(0, 5).map((r) => (
                    <div key={r.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-500 font-bold text-sm shrink-0">
                          {r.usuario_nombre?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{r.usuario_nombre}</p>
                          <p className="text-xs text-gray-400">{r.actividad_nombre} · {r.dia}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-teal-500">${Number(r.total).toLocaleString("es-MX")}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.metodo_pago === "tarjeta" ? "bg-teal-50 text-teal-500" : "bg-green-50 text-green-600"}`}>
                          {r.metodo_pago === "tarjeta" ? "Tarjeta" : "Efectivo"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── PUEBLOS ── */}
        {seccion === "pueblos" && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 shadow">
              <div className="flex items-center gap-3 mb-4">
                <img src={iconPueblo} alt="pueblo" className="w-7 h-7" />
                <h2 className="text-2xl font-bold text-teal-500">Registrar Pueblo</h2>
              </div>
              <label className={labelClass}>Nombre del pueblo *</label>
              <input className={inputClass} placeholder="Ej: San Martín Tilcajete" value={pueblo.nombre} onChange={(e) => setPueblo({ ...pueblo, nombre: e.target.value })} />
              <label className={labelClass}>Descripción *</label>
              <textarea className={inputClass} placeholder="Descripción del pueblo mágico..." rows={3} value={pueblo.descripcion} onChange={(e) => setPueblo({ ...pueblo, descripcion: e.target.value })} />
              <label className={labelClass}>Imágenes del pueblo</label>
              <label className="cursor-pointer flex items-center gap-3 bg-teal-50 border-2 border-dashed border-blue-700/50 rounded-lg p-4 mb-3 hover:bg-teal-50 transition">
                <span className="text-2xl">📷</span>
                <span className="text-teal-500 font-semibold text-sm">
                  {subiendoImagen ? "Subiendo imágenes..." : "Seleccionar imágenes (puedes elegir varias)"}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  disabled={subiendoImagen}
                  onChange={(e) => handleSubirImagenes(e.target.files)}
                />
              </label>
              {previewImagenes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {previewImagenes.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg shadow" />
                      <button
                        onClick={() => handleQuitarImagen(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-gray-800 rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
              <Button text="Registrar pueblo" onClick={handlePueblo} />
            </div>

            <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 shadow overflow-y-auto" style={{ maxHeight: "80vh" }}>
              <div className="flex items-center gap-3 mb-4">
                <img src={iconPueblo} alt="pueblo" className="w-7 h-7" />
                <h2 className="text-2xl font-bold text-teal-500">Pueblos registrados ({pueblosRegistrados.length})</h2>
              </div>
              {pueblosRegistrados.length === 0 ? (
                <p className="text-gray-400">Aún no hay pueblos registrados</p>
              ) : (
                pueblosRegistrados.map((p) => (
                  <div key={p.id} className="border-b border-gray-100 py-3 last:border-0">
                    {editandoPueblo?.id === p.id ? (
                      <div>
                        <input
                          className={inputEditClass}
                          value={editandoPueblo.nombre}
                          onChange={(e) => setEditandoPueblo({ ...editandoPueblo, nombre: e.target.value })}
                        />
                        <textarea
                          className={inputEditClass}
                          rows={2}
                          value={editandoPueblo.descripcion}
                          onChange={(e) => setEditandoPueblo({ ...editandoPueblo, descripcion: e.target.value })}
                        />
                        <label className="cursor-pointer flex items-center gap-2 bg-teal-50 border border-dashed border-blue-700/50 rounded-lg p-3 mb-2 hover:bg-teal-50 transition text-sm">
                          <span>📷</span>
                          <span className="text-teal-500 font-semibold">Cambiar imágenes</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const formData = new FormData();
                              Array.from(e.target.files).forEach((f) => formData.append("imagenes[]", f));
                              const res = await fetch("http://localhost/alebrijes/upload.php", { method: "POST", body: formData });
                              const data = await res.json();
                              if (data.success) {
                                const actuales = JSON.parse(editandoPueblo.imagen_url || "[]");
                                setEditandoPueblo({ ...editandoPueblo, imagen_url: JSON.stringify([...actuales, ...data.urls]) });
                              }
                            }}
                          />
                        </label>
                        {editandoPueblo.imagen_url && (() => {
                          try {
                            const imgs = JSON.parse(editandoPueblo.imagen_url);
                            return Array.isArray(imgs) && imgs.length > 0 ? (
                              <div className="flex gap-2 flex-wrap mb-2">
                                {imgs.map((url, i) => <img key={i} src={url} className="w-16 h-16 object-cover rounded-lg" />)}
                              </div>
                            ) : null;
                          } catch { return null; }
                        })()}
                        <div className="flex gap-2">
                          <button onClick={handleGuardarPueblo} className="bg-teal-500 text-gray-800 px-3 py-1 rounded-lg text-sm hover:bg-teal-600">Guardar</button>
                          <button onClick={() => setEditandoPueblo(null)} className="bg-gray-700 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-200">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <img src={iconPueblo} alt="pueblo" className="w-4 h-4" />
                          <p className="font-semibold text-gray-800">{p.nombre}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{p.descripcion}</p>
                        {p.imagen_url && (() => {
                          try {
                            const imgs = JSON.parse(p.imagen_url);
                            const src = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : p.imagen_url;
                            return <img src={src} alt={p.nombre} className="w-full h-24 object-cover rounded-lg mb-2" />;
                          } catch {
                            return <img src={p.imagen_url} alt={p.nombre} className="w-full h-24 object-cover rounded-lg mb-2" />;
                          }
                        })()}
                        <div className="flex gap-2">
                          <button onClick={() => setEditandoPueblo(p)} className="bg-teal-50 text-teal-600 border border-teal-200 px-3 py-1 rounded-lg text-sm hover:bg-teal-50">Editar</button>
                          <button onClick={() => handleEliminarPueblo(p.id, p.nombre)} className="bg-red-900/30 text-red-400 border border-red-700/40 px-3 py-1 rounded-lg text-sm hover:bg-red-900/50">Eliminar</button>
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
            {/* Formulario de registro */}
            <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 shadow">
              <div className="flex items-center gap-3 mb-4">
                <img src={iconEmpresa} alt="empresa" className="w-7 h-7" />
                <h2 className="text-2xl font-bold text-teal-500">Registrar Empresa</h2>
              </div>
              <label className={labelClass}>Nombre *</label>
              <input className={inputClass} placeholder="Nombre de la empresa" value={empresa.nombre} onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })} />
              {erroresEmpresa.nombre && <p className="text-red-400 text-xs -mt-3 mb-3">⚠ {erroresEmpresa.nombre}</p>}
              <label className={labelClass}>Dirección *</label>
              <input className={inputClass} placeholder="Calle, número, colonia" value={empresa.direccion} onChange={(e) => setEmpresa({ ...empresa, direccion: e.target.value })} />
              {erroresEmpresa.direccion && <p className="text-red-400 text-xs -mt-3 mb-3">⚠ {erroresEmpresa.direccion}</p>}
              <label className={labelClass}>
                RFC *
                <span className="text-gray-400 font-normal ml-1 text-xs">(12 caracteres: 3-4 letras + 6 números + 3 alfanuméricos)</span>
              </label>
              <input
                className={`${inputClass} uppercase`}
                placeholder="Ej: XAXX010101000"
                maxLength={13}
                value={empresa.rfc}
                onChange={(e) => setEmpresa({ ...empresa, rfc: e.target.value.toUpperCase() })}
              />
              {erroresEmpresa.rfc && <p className="text-red-400 text-xs -mt-3 mb-3">⚠ {erroresEmpresa.rfc}</p>}
              <label className={labelClass}>
                Teléfono *
                <span className="text-gray-400 font-normal ml-1 text-xs">(10 dígitos sin espacios)</span>
              </label>
              <input
                className={inputClass}
                placeholder="Ej: 9511234567"
                maxLength={10}
                value={empresa.telefono}
                onChange={(e) => setEmpresa({ ...empresa, telefono: e.target.value.replace(/\D/g, "").substring(0, 10) })}
              />
              {erroresEmpresa.telefono && <p className="text-red-400 text-xs -mt-3 mb-3">⚠ {erroresEmpresa.telefono}</p>}
              <label className={labelClass}>Pueblo *</label>
              <select className={inputClass} value={empresa.pueblo_id} onChange={(e) => setEmpresa({ ...empresa, pueblo_id: e.target.value })}>
                <option value="">-- Selecciona un pueblo --</option>
                {pueblosRegistrados.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              {erroresEmpresa.pueblo_id && <p className="text-red-400 text-xs -mt-3 mb-3">⚠ {erroresEmpresa.pueblo_id}</p>}
              <p className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 mb-4">
                El precio y los servicios del paquete se configuran en la sección <strong>Actividades</strong> al crear el itinerario.
              </p>
              <Button text="Registrar empresa" onClick={handleEmpresa} />
            </div>

            {/* Lista de empresas */}
            <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 shadow overflow-y-auto" style={{ maxHeight: "80vh" }}>
              <div className="flex items-center gap-3 mb-4">
                <img src={iconEmpresa} alt="empresa" className="w-7 h-7" />
                <h2 className="text-2xl font-bold text-teal-500">Empresas ({empresasRegistradas.length})</h2>
              </div>
              {empresasRegistradas.length === 0 ? (
                <p className="text-gray-400">Aún no hay empresas registradas</p>
              ) : (
                empresasRegistradas.map((e) => (
                  <div key={e.id} className="border-b border-gray-100 py-3 last:border-0">
                    {editandoEmpresa?.id === e.id ? (
                      <div>
                        <input className={inputEditClass} placeholder="Nombre" value={editandoEmpresa.nombre} onChange={(x) => setEditandoEmpresa({ ...editandoEmpresa, nombre: x.target.value })} />
                        <input className={inputEditClass} placeholder="Dirección" value={editandoEmpresa.direccion} onChange={(x) => setEditandoEmpresa({ ...editandoEmpresa, direccion: x.target.value })} />
                        <input className={inputEditClass} placeholder="RFC" value={editandoEmpresa.rfc} onChange={(x) => setEditandoEmpresa({ ...editandoEmpresa, rfc: x.target.value.toUpperCase() })} />
                        <input className={inputEditClass} placeholder="Teléfono (10 dígitos)" maxLength={10} value={editandoEmpresa.telefono} onChange={(x) => setEditandoEmpresa({ ...editandoEmpresa, telefono: x.target.value.replace(/\D/g, "").substring(0, 10) })} />
                        <div className="flex gap-2 mt-2">
                          <button onClick={handleGuardarEmpresa} className="bg-teal-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-teal-600">Guardar</button>
                          <button onClick={() => setEditandoEmpresa(null)} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-200">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-gray-800 mb-0.5">{e.nombre}</p>
                        <p className="text-sm text-gray-500">{e.direccion}</p>
                        <p className="text-xs text-gray-400">{e.telefono}</p>
                        <p className="text-xs text-teal-500 font-semibold">{e.pueblo_nombre || e.pueblo}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => setEditandoEmpresa(e)} className="bg-teal-50 text-teal-600 border border-teal-200 px-3 py-1 rounded-lg text-xs hover:bg-teal-100">Editar</button>
                          <button onClick={() => handleEliminarEmpresa(e.id, e.nombre)} className="bg-red-50 text-red-400 border border-red-200 px-3 py-1 rounded-lg text-xs hover:bg-red-100">Eliminar</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── ACTIVIDADES / ITINERARIO ── */}
        {seccion === "actividades" && (
          <>
          <div className="grid grid-cols-2 gap-8">

            {/* Panel izquierdo: formulario + pending */}
            <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <img src={iconActividades} alt="actividad" className="w-7 h-7" />
                <h2 className="text-2xl font-bold text-teal-500">Crear itinerario</h2>
              </div>

              <label className={labelClass}>Empresa *</label>
              <select
                className={inputClass}
                value={actividad.empresa_id}
                onChange={(e) => {
                  setActividad({ nombre: "", descripcion: "", hora_inicio: "", empresa_id: e.target.value });
                  setPendingActividades([]);
                  setShowSaveItinerario(false);
                  setItinerarioForm({ nombre: "", precio: "" });
                }}
              >
                <option value="">-- Selecciona una empresa --</option>
                {empresasRegistradas.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
              {erroresActividad.empresa_id && <p className="text-red-400 text-xs -mt-3 mb-3">⚠ {erroresActividad.empresa_id}</p>}

              <label className={labelClass}>Hora *</label>
              <input
                className={inputClass}
                type="time"
                value={actividad.hora_inicio}
                onChange={(e) => setActividad({ ...actividad, hora_inicio: e.target.value })}
              />
              {erroresActividad.hora_inicio && <p className="text-red-400 text-xs -mt-3 mb-3">⚠ {erroresActividad.hora_inicio}</p>}

              <label className={labelClass}>Actividad *</label>
              <input
                className={inputClass}
                placeholder="Ej: Desayuno típico oaxaqueño"
                value={actividad.nombre}
                onChange={(e) => setActividad({ ...actividad, nombre: e.target.value })}
              />
              {erroresActividad.nombre && <p className="text-red-400 text-xs -mt-3 mb-3">⚠ {erroresActividad.nombre}</p>}

              <label className={labelClass}>Descripción</label>
              <textarea
                className={inputClass}
                placeholder="Detalles de la actividad..."
                rows={2}
                value={actividad.descripcion}
                onChange={(e) => setActividad({ ...actividad, descripcion: e.target.value })}
              />

              <Button text="+ Agregar actividad" onClick={handleAddPending} />


              {/* Lista de actividades pendientes */}
              {pendingActividades.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600">
                      Itinerario en proceso ({pendingActividades.length})
                    </p>
                    <button
                      onClick={() => { setPendingActividades([]); setShowSaveItinerario(false); }}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Descartar todo
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    {[...pendingActividades]
                      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
                      .map((a) => (
                        <div key={a.id} className="flex items-center gap-3 bg-teal-50 border border-teal-100 rounded-xl px-3 py-2">
                          <span className="text-xs font-bold text-teal-600 w-10 shrink-0">{a.hora_inicio}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{a.nombre}</p>
                            {a.descripcion && <p className="text-xs text-gray-400 truncate">{a.descripcion}</p>}
                          </div>
                          <button
                            onClick={() => setPendingActividades(pendingActividades.filter((x) => x.id !== a.id))}
                            className="text-red-400 hover:text-red-600 text-sm shrink-0"
                          >✕</button>
                        </div>
                      ))}
                  </div>

                  {/* Formulario de guardado */}
                  {!showSaveItinerario ? (
                    <button
                      onClick={() => setShowSaveItinerario(true)}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition"
                    >
                      Guardar itinerario →
                    </button>
                  ) : (
                    <div className="bg-stone-50 border border-teal-100 rounded-xl p-4">
                      <p className="text-sm font-semibold text-teal-500 mb-3">Guardar como paquete</p>
                      <label className={labelClass}>Nombre del paquete</label>
                      <input
                        className={inputClass}
                        placeholder='Ej: "Tour clásico", "Paquete familiar"'
                        value={itinerarioForm.nombre}
                        onChange={(e) => setItinerarioForm({ ...itinerarioForm, nombre: e.target.value })}
                      />
                      <label className={labelClass}>Precio por persona *</label>
                      <input
                        className={inputClass}
                        type="number"
                        placeholder="Ej: 850"
                        value={itinerarioForm.precio}
                        onChange={(e) => setItinerarioForm({ ...itinerarioForm, precio: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleGuardarItinerario}
                          className="flex-1 bg-teal-500 text-white font-semibold py-2 rounded-xl hover:bg-teal-600 transition text-sm"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setShowSaveItinerario(false)}
                          className="flex-1 bg-gray-100 text-gray-600 font-semibold py-2 rounded-xl hover:bg-gray-200 transition text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Panel derecho: itinerarios guardados */}
            <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 overflow-y-auto" style={{ maxHeight: "80vh" }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-teal-500">Itinerarios guardados</h2>
                <span className="text-xs font-semibold bg-teal-50 text-teal-600 border border-teal-100 px-3 py-1 rounded-full">
                  {itinerariosRegistrados.length} total
                </span>
              </div>

              {/* Chips de empresa para filtrar */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setFiltroEmpresa("")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${!filtroEmpresa ? "bg-teal-500 text-white border-teal-500" : "bg-white text-gray-500 border-gray-200 hover:border-teal-300"}`}
                >
                  Todas
                </button>
                {empresasRegistradas.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setFiltroEmpresa(String(e.id) === filtroEmpresa ? "" : String(e.id))}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${filtroEmpresa === String(e.id) ? "bg-teal-500 text-white border-teal-500" : "bg-white text-gray-500 border-gray-200 hover:border-teal-300"}`}
                  >
                    {e.nombre}
                  </button>
                ))}
              </div>

              {(() => {
                const lista = itinerariosRegistrados.filter(
                  (it) => !filtroEmpresa || String(it.empresa_id) === filtroEmpresa
                );

                if (lista.length === 0) return (
                  <div className="text-center py-10">
                    <img src={iconActividades} alt="itinerarios" className="w-14 h-14 mx-auto mb-3 opacity-20" />
                    <p className="text-gray-400 font-semibold">
                      {filtroEmpresa ? "Esta empresa aún no tiene itinerarios" : "No hay itinerarios registrados"}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">Crea el primero con el formulario de la izquierda</p>
                  </div>
                );

                return (
                  <div className="flex flex-col gap-4">
                    {lista.map((it) => (
                      <div key={it.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                        {/* Header del itinerario */}
                        <div className="flex items-center justify-between px-4 py-3 bg-teal-50 border-b border-teal-100">
                          <div>
                            <p className="font-bold text-gray-800">{it.nombre}</p>
                            {it.empresa_nombre && (
                              <p className="text-xs text-gray-400">{it.empresa_nombre}</p>
                            )}
                            <div className="flex items-center gap-3 mt-0.5">
                              <p className="text-teal-600 font-semibold text-sm">
                                ${Number(it.precio).toLocaleString("es-MX")} / persona
                              </p>
                              <span className="text-xs text-gray-400">{it.actividades.length} actividad{it.actividades.length !== 1 ? "es" : ""}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEliminarItinerario(it.id, it.nombre)}
                            className="text-xs text-red-400 border border-red-200 bg-white px-3 py-1 rounded-lg hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>

                        {/* Actividades del itinerario */}
                        {it.actividades.length === 0 ? (
                          <p className="text-xs text-gray-400 px-4 py-3">Sin actividades registradas</p>
                        ) : (
                          <div className="relative px-4 py-3">
                            <div className="absolute left-7 top-3 bottom-3 w-0.5 bg-teal-100" />
                            {it.actividades.map((a) => (
                              <div key={a.id} className="flex gap-3 mb-3 last:mb-0">
                                <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10 shadow-sm">
                                  {a.hora_inicio.substring(0, 5)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-800">{a.nombre}</p>
                                  {a.descripcion && <p className="text-xs text-gray-400">{a.descripcion}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
          </>
        )}

        {/* ── USUARIOS ── */}
        {seccion === "usuarios" && (
          <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 shadow">
            <div className="flex items-center gap-3 mb-4">
              <img src={iconActividades} alt="usuarios" className="w-7 h-7" />
              <h2 className="text-2xl font-bold text-teal-500">Usuarios registrados ({usuarios.length})</h2>
            </div>
            {usuarios.length === 0 ? (
              <p className="text-gray-400">No hay usuarios registrados aún</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-50 text-left border-b border-teal-700/30">
                    <th className="p-3 text-teal-500 font-semibold rounded-l-lg">Nombre</th>
                    <th className="p-3 text-teal-500 font-semibold">Email</th>
                    <th className="p-3 text-teal-500 font-semibold rounded-r-lg">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100 last:border-0">
                      <td className="p-3 font-semibold text-gray-800">{u.nombre}</td>
                      <td className="p-3 text-gray-600">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.rol === "admin" ? "bg-teal-50 text-teal-600 border border-teal-200" : "bg-gray-800 text-gray-600 border border-gray-700"}`}>
                          {u.rol}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── RESERVACIONES ── */}
        {seccion === "reservaciones" && (
          <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 shadow">
            <div className="flex items-center gap-3 mb-4">
              <img src={iconReservaciones} alt="reservaciones" className="w-7 h-7" />
              <h2 className="text-2xl font-bold text-teal-500">Reservaciones ({reservaciones.length})</h2>
            </div>
            {reservaciones.length === 0 ? (
              <div className="text-center py-12">
                <img src={iconReservaciones} alt="sin reservaciones" className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-gray-400">Aún no hay reservaciones registradas.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-50 text-left border-b border-teal-700/30">
                    <th className="p-3 text-teal-500 font-semibold rounded-l-lg">Usuario</th>
                    <th className="p-3 text-teal-500 font-semibold">Tour / Actividad</th>
                    <th className="p-3 text-teal-500 font-semibold">Día</th>
                    <th className="p-3 text-teal-500 font-semibold">Pers.</th>
                    <th className="p-3 text-teal-500 font-semibold">Total</th>
                    <th className="p-3 text-teal-500 font-semibold">Pago</th>
                    <th className="p-3 text-teal-500 font-semibold rounded-r-lg">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reservaciones.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-stone-50 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-500 font-bold text-xs shrink-0">
                            {r.usuario_nombre?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800">{r.usuario_nombre}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600 max-w-[160px] truncate">{r.actividad_nombre}</td>
                      <td className="p-3 text-gray-600">{r.dia}</td>
                      <td className="p-3 text-gray-600">{r.personas}</td>
                      <td className="p-3 text-teal-500 font-bold">${Number(r.total).toLocaleString("es-MX")}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <img src={r.metodo_pago === "tarjeta" ? iconTarjeta : iconEfectivo} alt="pago" className="w-4 h-4" />
                          <span className="text-xs text-gray-500">{r.metodo_pago === "tarjeta" ? "Tarjeta" : "Efectivo"}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          value={r.estado || "pendiente"}
                          onChange={async (e) => {
                            const nuevoEstado = e.target.value;
                            const res = await fetch("http://localhost/alebrijes/reservaciones.php", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: r.id, estado: nuevoEstado }),
                            });
                            const data = await res.json();
                            if (data.success) cargarReservaciones();
                          }}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                            (r.estado || "pendiente") === "confirmada" ? "bg-teal-50 text-teal-600 border-teal-200" :
                            (r.estado || "pendiente") === "cancelada"  ? "bg-red-50 text-red-500 border-red-200" :
                            "bg-yellow-50 text-yellow-600 border-yellow-200"
                          }`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;
