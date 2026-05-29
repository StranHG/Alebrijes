import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import iconPersonas from "../assets/numeroDePersonas.png";
import iconReservaciones from "../assets/reservaciones.png";
import iconCalendario from "../assets/caledario.png";
import iconTarjeta from "../assets/tarjeta-bancaria.png";
import iconEfectivo from "../assets/efectivo.png";
import iconAlebrije from "../assets/alebrije.png";

function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem("usuario")));
  const [reservaciones, setReservaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seccion, setSeccion] = useState("reservaciones");

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirmar, setPassConfirmar] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    if (!usuario) { navigate("/login"); return; }
    fetch(`http://localhost/alebrijes/reservaciones.php?usuario_id=${usuario.id}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setReservaciones(data.reservaciones); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  const mostrarMensaje = (texto, tipo = "ok") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3500);
  };

  const handleGuardarNombre = async () => {
    if (!nombre.trim() || nombre.trim().length < 3) {
      mostrarMensaje("El nombre debe tener al menos 3 caracteres", "error"); return;
    }
    const res = await fetch("http://localhost/alebrijes/usuarios.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: usuario.id, nombre: nombre.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      const actualizado = { ...usuario, nombre: nombre.trim() };
      localStorage.setItem("usuario", JSON.stringify(actualizado));
      setUsuario(actualizado);
      mostrarMensaje("Nombre actualizado correctamente");
    } else mostrarMensaje(data.mensaje || "Error al actualizar", "error");
  };

  const handleCambiarPassword = async () => {
    if (!passActual) { mostrarMensaje("Ingresa tu contraseña actual", "error"); return; }
    if (passNueva.length < 6) { mostrarMensaje("La nueva contraseña debe tener al menos 6 caracteres", "error"); return; }
    if (passNueva !== passConfirmar) { mostrarMensaje("Las contraseñas no coinciden", "error"); return; }
    const res = await fetch("http://localhost/alebrijes/usuarios.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: usuario.id, nombre: nombre.trim(), password_actual: passActual, password_nueva: passNueva }),
    });
    const data = await res.json();
    if (data.success) {
      setPassActual(""); setPassNueva(""); setPassConfirmar("");
      mostrarMensaje("Contraseña actualizada correctamente");
    } else mostrarMensaje(data.mensaje || "Error al actualizar", "error");
  };

  const estadoColor = {
    pendiente:  "bg-yellow-50 text-yellow-600 border border-yellow-200",
    confirmada: "bg-teal-50 text-teal-600 border border-teal-200",
    cancelada:  "bg-red-50 text-red-400 border border-red-200",
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-400 text-sm text-gray-800 bg-white placeholder-gray-400";

  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 flex items-center gap-5 mb-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{usuario.nombre}</h1>
            <p className="text-teal-100 text-sm">{usuario.email}</p>
            <span className="mt-1 inline-block text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full">
              {usuario.rol}
            </span>
          </div>
          <img src={iconAlebrije} alt="" className="w-14 h-14 ml-auto opacity-70" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "reservaciones", label: "Mis reservaciones" },
            { key: "editar",        label: "Editar perfil" },
            ...(!usuario.google ? [{ key: "password", label: "Cambiar contraseña" }] : []),
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSeccion(key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${seccion === key ? "bg-teal-500 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-teal-300"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mensaje global */}
        {mensaje.texto && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold ${mensaje.tipo === "error" ? "bg-red-50 text-red-500 border border-red-200" : "bg-teal-50 text-teal-600 border border-teal-200"}`}>
            {mensaje.texto}
          </div>
        )}

        {/* ── MIS RESERVACIONES ── */}
        {seccion === "reservaciones" && (
          <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Mis reservaciones ({reservaciones.length})</h2>
            {cargando ? (
              <p className="text-gray-400 text-center py-8">Cargando...</p>
            ) : reservaciones.length === 0 ? (
              <div className="text-center py-12">
                <img src={iconReservaciones} alt="sin reservaciones" className="w-14 h-14 mx-auto mb-3 opacity-20" />
                <p className="text-gray-400">Aún no tienes reservaciones</p>
                <button onClick={() => navigate("/")} className="mt-4 text-teal-500 font-semibold text-sm hover:underline">
                  Explorar pueblos →
                </button>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-100">
                {reservaciones.map((r) => (
                  <div key={r.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                        <img src={r.metodo_pago === "tarjeta" ? iconTarjeta : iconEfectivo} alt="pago" className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{r.actividad_nombre}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <img src={iconCalendario} alt="" className="w-3 h-3" />{r.dia}
                          </span>
                          <span className="flex items-center gap-1">
                            <img src={iconPersonas} alt="" className="w-3 h-3" />{r.personas} pers.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${estadoColor[r.estado] || estadoColor.pendiente}`}>
                        {r.estado || "pendiente"}
                      </span>
                      <p className="text-teal-500 font-bold text-sm">${Number(r.total).toLocaleString("es-MX")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── EDITAR PERFIL ── */}
        {seccion === "editar" && (
          <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Editar información</h2>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Nombre completo</label>
            <input className={inputClass} value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <label className="text-xs font-semibold text-gray-500 mb-1 mt-3 block">Correo electrónico</label>
            <input className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`} value={usuario.email} disabled />
            <p className="text-xs text-gray-400 mb-4">El correo no se puede modificar.</p>
            <button
              onClick={handleGuardarNombre}
              className="inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm px-6 py-2 rounded-xl shadow-sm hover:shadow-md hover:from-teal-600 hover:to-teal-700 transition-all active:scale-95"
            >
              Guardar cambios
            </button>
          </div>
        )}

        {/* ── CAMBIAR CONTRASEÑA ── */}
        {seccion === "password" && (
          <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Cambiar contraseña</h2>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Contraseña actual</label>
            <input type="password" className={`${inputClass} mb-3`} value={passActual} onChange={(e) => setPassActual(e.target.value)} placeholder="••••••" />
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Nueva contraseña</label>
            <input type="password" className={`${inputClass} mb-1`} value={passNueva} onChange={(e) => setPassNueva(e.target.value)} placeholder="Mínimo 6 caracteres" />
            {passNueva && passNueva.length < 6 && <p className="text-xs text-red-400 mb-2">Mínimo 6 caracteres</p>}
            <label className="text-xs font-semibold text-gray-500 mb-1 mt-2 block">Confirmar nueva contraseña</label>
            <input type="password" className={`${inputClass} mb-1`} value={passConfirmar} onChange={(e) => setPassConfirmar(e.target.value)} placeholder="Repite la nueva contraseña" />
            {passConfirmar && passNueva !== passConfirmar && <p className="text-xs text-red-400 mb-2">Las contraseñas no coinciden</p>}
            <button
              onClick={handleCambiarPassword}
              className="mt-4 inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm px-6 py-2 rounded-xl shadow-sm hover:shadow-md hover:from-teal-600 hover:to-teal-700 transition-all active:scale-95"
            >
              Actualizar contraseña
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Perfil;
