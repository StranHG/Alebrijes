import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import iconEfectivo from "../assets/efectivo.png";
import iconTarjeta from "../assets/tarjeta-bancaria.png";
import iconReloj from "../assets/reloj.png";
import iconLike from "../assets/Like.png";
import iconAlebrije from "../assets/alebrije.png";
import iconCalendario from "../assets/caledario.png";
import iconPersonas from "../assets/numeroDePersonas.png";
import iconDescarga from "../assets/descarga.png";

function generarFolio() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function Resumen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(null);
  const [metodoPago, setMetodoPago] = useState(null);
  const [confirmado, setConfirmado] = useState(false);
  const [folio] = useState(generarFolio);
  const [procesando, setProcesando] = useState(false);
  const [tarjeta, setTarjeta] = useState({ nombre: "", numero: "", expiracion: "", cvv: "" });
  const [erroresTarjeta, setErroresTarjeta] = useState({});

  if (!state) return <p className="text-center mt-10">No hay actividades seleccionadas.</p>;

  const isPaquete = !!state.paquete;
  const { actividades, total, empresa } = isPaquete
    ? { actividades: [], total: state.total, empresa: state.empresa }
    : state;
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const fecha = new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

  const validarTarjeta = () => {
    const errs = {};
    if (!tarjeta.nombre.trim()) errs.nombre = "Ingresa el nombre del titular";
    const numLimpio = tarjeta.numero.replace(/\s/g, "");
    if (!/^\d{16}$/.test(numLimpio)) errs.numero = "El número debe tener 16 dígitos";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(tarjeta.expiracion)) errs.expiracion = "Formato MM/AA requerido";
    if (!/^\d{3}$/.test(tarjeta.cvv)) errs.cvv = "El CVV debe tener 3 dígitos";
    setErroresTarjeta(errs);
    return Object.keys(errs).length === 0;
  };

  const formatearNumeroTarjeta = (val) => {
    const limpio = val.replace(/\D/g, "").substring(0, 16);
    return limpio.replace(/(.{4})/g, "$1 ").trim();
  };

  const handlePagar = async () => {
    if (metodoPago === "tarjeta" && !validarTarjeta()) return;
    setProcesando(true);
    if (isPaquete) {
      await fetch("http://localhost/alebrijes/reservaciones.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuario?.id,
          actividad_id: null,
          empresa_id: state.empresa_id,
          dia: state.dia,
          personas: state.personas,
          total: state.total,
          metodo_pago: metodoPago,
        }),
      }).catch(() => {});
    } else {
      for (const a of actividades) {
        await fetch("http://localhost/alebrijes/reservaciones.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: usuario?.id,
            actividad_id: a.id,
            empresa_id: null,
            dia: a.dia,
            personas: a.personas,
            total: a.totalActividad,
            metodo_pago: metodoPago,
          }),
        }).catch(() => {});
      }
    }
    setProcesando(false);
    setConfirmado(true);
  };

  const handleDescargar = () => {
    window.print();
  };

  return (
    <>
      {/* Estilos solo para impresión */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #ticket-imprimir, #ticket-imprimir * { visibility: visible; }
          #ticket-imprimir { position: fixed; top: 0; left: 0; width: 100%; padding: 40px; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-stone-50">
        <div className="no-print">
          <Navbar />
        </div>
        <div className="max-w-5xl mx-auto p-8">

          {/* ── BARRA DE PASOS ── */}
          <div className="flex items-center mb-8 no-print">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
              <span className="text-sm font-semibold text-teal-500">Selección</span>
            </div>
            <div className="flex-1 h-0.5 mx-3 bg-teal-300" />
            <div className="flex items-center gap-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-offset-1 ${confirmado ? "bg-teal-500 text-white ring-teal-300" : "bg-teal-500 text-white ring-teal-300"}`}>
                {confirmado ? "✓" : "2"}
              </div>
              <span className="text-sm font-semibold text-teal-500">Pago</span>
            </div>
            <div className={`flex-1 h-0.5 mx-3 ${confirmado ? "bg-teal-300" : "bg-gray-200"}`} />
            <div className="flex items-center gap-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${confirmado ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                {confirmado ? "✓" : "3"}
              </div>
              <span className={`text-sm font-semibold ${confirmado ? "text-teal-500" : "text-gray-400"}`}>Confirmado</span>
            </div>
          </div>

          {!confirmado ? (
            <div className="grid grid-cols-2 gap-6 items-start">

              {/* ── COLUMNA IZQUIERDA: resumen ── */}
              <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 sticky top-6">
                <h2 className="text-xl font-bold text-teal-500 mb-1">Tu reserva</h2>
                <p className="text-gray-400 text-sm mb-4">{empresa}</p>

                {isPaquete ? (
                  <div className="py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={iconLike} alt="ok" className="w-4 h-4" />
                      <p className="font-semibold text-gray-700">{state.itinerario_nombre || "Paquete completo"}</p>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-2">
                        <img src={iconCalendario} alt="fecha" className="w-4 h-4 opacity-60" />
                        {state.dia}
                      </span>
                      <span className="flex items-center gap-2">
                        <img src={iconPersonas} alt="personas" className="w-4 h-4 opacity-60" />
                        {state.personas} persona{state.personas !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {state.itinerario_actividades?.length > 0 && (
                      <div className="mt-3 pl-2 border-l-2 border-teal-100">
                        {state.itinerario_actividades.slice(0, 4).map((a) => (
                          <div key={a.id} className="flex items-center gap-2 py-0.5">
                            <span className="text-xs font-bold text-teal-500 w-10 shrink-0">{a.hora_inicio.substring(0,5)}</span>
                            <span className="text-xs text-gray-500 truncate">{a.nombre}</span>
                          </div>
                        ))}
                        {state.itinerario_actividades.length > 4 && (
                          <p className="text-xs text-gray-400 mt-1">+{state.itinerario_actividades.length - 4} actividades más</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  actividades.map((a) => (
                    <div key={a.id} className="flex justify-between items-center py-3 border-b last:border-0">
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">{a.nombre}</p>
                        <p className="text-xs text-gray-400">{a.hora_inicio} · {a.personas} pers. · {a.dia}</p>
                      </div>
                      <p className="text-teal-500 font-bold text-sm">${a.totalActividad}</p>
                    </div>
                  ))
                )}

                <div className="mt-4 pt-4 border-t border-teal-100 flex justify-between items-center">
                  <p className="font-bold text-gray-800">Total</p>
                  <p className="text-2xl font-bold text-teal-500">${total.toLocaleString("es-MX")}</p>
                </div>
              </div>

              {/* ── COLUMNA DERECHA: pago ── */}
              <div>
                <h2 className="text-xl font-bold text-teal-500 mb-4">¿Cómo quieres pagar?</h2>

                <div className="flex flex-col gap-3 mb-5">
                  <button
                    onClick={() => setMetodoPago("llegando")}
                    className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-4 ${
                      metodoPago === "llegando" ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-white hover:border-teal-200"
                    }`}
                  >
                    <img src={iconEfectivo} alt="efectivo" className="w-10 h-10 shrink-0" />
                    <div>
                      <p className="font-bold text-gray-800">Pagar al llegar</p>
                      <p className="text-sm text-gray-400">Paga en efectivo al llegar al destino</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setMetodoPago("tarjeta")}
                    className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-4 ${
                      metodoPago === "tarjeta" ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-white hover:border-teal-200"
                    }`}
                  >
                    <img src={iconTarjeta} alt="tarjeta" className="w-10 h-10 shrink-0" />
                    <div>
                      <p className="font-bold text-gray-800">Pagar con tarjeta</p>
                      <p className="text-sm text-gray-400">Pago seguro en línea</p>
                    </div>
                  </button>
                </div>

                {metodoPago === "tarjeta" && (
                  <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-5 mb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <img src={iconTarjeta} alt="tarjeta" className="w-5 h-5" />
                      <h3 className="font-bold text-teal-500">Datos de tarjeta</h3>
                    </div>

                    <label className="text-xs text-gray-500 mb-1 block">Nombre del titular</label>
                    <input
                      placeholder="Como aparece en la tarjeta"
                      value={tarjeta.nombre}
                      onChange={(e) => setTarjeta({ ...tarjeta, nombre: e.target.value })}
                      className="w-full border border-gray-200 bg-white text-gray-800 placeholder-gray-400 rounded-lg p-3 mb-1 outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                    {erroresTarjeta.nombre && <p className="text-red-400 text-xs mb-2">⚠ {erroresTarjeta.nombre}</p>}

                    <label className="text-xs text-gray-500 mb-1 block mt-2">Número de tarjeta</label>
                    <input
                      placeholder="0000 0000 0000 0000"
                      value={tarjeta.numero}
                      onChange={(e) => setTarjeta({ ...tarjeta, numero: formatearNumeroTarjeta(e.target.value) })}
                      maxLength={19}
                      className="w-full border border-gray-200 bg-white text-gray-800 placeholder-gray-400 rounded-lg p-3 mb-1 outline-none focus:ring-2 focus:ring-teal-500 tracking-widest text-sm"
                    />
                    {erroresTarjeta.numero && <p className="text-red-400 text-xs mb-2">⚠ {erroresTarjeta.numero}</p>}

                    <div className="flex gap-3 mt-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Vencimiento (MM/AA)</label>
                        <input
                          placeholder="MM/AA"
                          value={tarjeta.expiracion}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "").substring(0, 4);
                            if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                            setTarjeta({ ...tarjeta, expiracion: v });
                          }}
                          maxLength={5}
                          className="w-full border border-gray-200 bg-white text-gray-800 placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                        {erroresTarjeta.expiracion && <p className="text-red-400 text-xs mt-1">⚠ {erroresTarjeta.expiracion}</p>}
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">CVV</label>
                        <input
                          placeholder="123"
                          value={tarjeta.cvv}
                          onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value.replace(/\D/g, "").substring(0, 3) })}
                          maxLength={3}
                          type="password"
                          className="w-full border border-gray-200 bg-white text-gray-800 placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                        {erroresTarjeta.cvv && <p className="text-red-400 text-xs mt-1">⚠ {erroresTarjeta.cvv}</p>}
                      </div>
                    </div>

                    {/* Badges de seguridad */}
                    <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1 text-xs text-gray-400">🔒 Pago seguro</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">🛡️ Datos encriptados</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">✓ SSL</span>
                    </div>
                  </div>
                )}

                {metodoPago && (
                  <Button
                    text={procesando ? "Procesando..." : "Confirmar reserva ✓"}
                    onClick={procesando ? undefined : handlePagar}
                  />
                )}
              </div>
            </div>
          ) : (
            /* ── TICKET ── */
            <div>
              <div
                id="ticket-imprimir"
                ref={ticketRef}
                className="bg-white border border-teal-100 shadow-sm rounded-2xl shadow overflow-hidden mb-4"
              >
                {/* Header */}
                <div className="bg-teal-500 text-center py-8 px-6">
                  <img src={iconAlebrije} alt="alebrije" className="w-14 h-14 mx-auto mb-2 drop-shadow-lg" />
                  <h1 className="text-2xl font-bold text-white">Alebrijes Oaxaca</h1>
                  <p className="text-teal-100 text-sm mt-1">Comprobante de reserva</p>
                </div>

                {/* Folio y fecha */}
                <div className="flex justify-between items-center px-6 py-3 bg-teal-50 border-b border-teal-100">
                  <div>
                    <p className="text-xs text-gray-400">Folio de reserva</p>
                    <p className="text-teal-500 font-bold text-xl tracking-widest">{folio}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Emitido el</p>
                    <p className="text-gray-700 text-sm font-semibold">{fecha}</p>
                  </div>
                </div>

                {/* Viajero + empresa */}
                <div className="grid grid-cols-2 border-b border-teal-100">
                  <div className="px-6 py-4 border-r border-teal-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Viajero</p>
                    <p className="font-bold text-gray-800">{usuario?.nombre || "Invitado"}</p>
                    {usuario?.email && <p className="text-xs text-gray-400 mt-0.5">{usuario.email}</p>}
                    <div className="flex items-center gap-1 mt-1">
                      <img src={iconPersonas} alt="personas" className="w-3.5 h-3.5 opacity-50" />
                      <p className="text-xs text-gray-500">
                        {isPaquete ? state.personas : actividades[0]?.personas} persona{(isPaquete ? state.personas : actividades[0]?.personas) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Empresa</p>
                    <p className="font-bold text-gray-800">{empresa}</p>
                    {isPaquete && state.empresa_direccion && (
                      <p className="text-xs text-gray-400 mt-0.5">{state.empresa_direccion}</p>
                    )}
                    {isPaquete && state.empresa_telefono && (
                      <div className="flex items-center gap-1 mt-1">
                        <img src={iconPersonas} alt="tel" className="w-3.5 h-3.5 opacity-40" />
                        <p className="text-xs text-gray-500">{state.empresa_telefono}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalle del tour */}
                <div className="px-6 pt-4 pb-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                    {isPaquete ? state.itinerario_nombre || "Paquete reservado" : "Actividades reservadas"}
                  </p>

                  {isPaquete ? (
                    <>
                      {/* Info del tour */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <img src={iconCalendario} alt="fecha" className="w-4 h-4" />
                          {state.dia}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <img src={iconPersonas} alt="personas" className="w-4 h-4" />
                          {state.personas} persona{state.personas !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Itinerario del paquete */}
                      {state.itinerario_actividades?.length > 0 && (
                        <div className="relative mb-4">
                          <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-teal-100" />
                          {state.itinerario_actividades.map((a) => (
                            <div key={a.id} className="flex gap-3 mb-2.5 last:mb-0">
                              <div className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
                                {a.hora_inicio.substring(0, 5)}
                              </div>
                              <div className="flex-1 pt-0.5">
                                <p className="text-sm font-semibold text-gray-800">{a.nombre}</p>
                                {a.descripcion && <p className="text-xs text-gray-400">{a.descripcion}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    actividades.map((a, i) => (
                      <div key={a.id} className={`flex justify-between items-start py-3 ${i < actividades.length - 1 ? "border-b border-dashed border-teal-100" : ""}`}>
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">{a.nombre}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><img src={iconCalendario} alt="" className="w-3 h-3" />{a.dia}</span>
                            <span className="flex items-center gap-1"><img src={iconReloj} alt="" className="w-3 h-3" />{a.hora_inicio}</span>
                            <span className="flex items-center gap-1"><img src={iconPersonas} alt="" className="w-3 h-3" />{a.personas} pers.</span>
                          </div>
                        </div>
                        <p className="text-teal-500 font-bold text-sm">${a.totalActividad}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Total y método */}
                <div className="mx-6 mb-4 p-4 bg-teal-50 border border-teal-100 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={metodoPago === "tarjeta" ? iconTarjeta : iconEfectivo} alt="pago" className="w-8 h-8" />
                    <div>
                      <p className="text-xs text-gray-400">Método de pago</p>
                      <p className="text-gray-700 font-semibold text-sm">
                        {metodoPago === "tarjeta" ? "Tarjeta bancaria" : "Pago al llegar"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total pagado</p>
                    <p className="text-2xl font-bold text-teal-500">${total.toLocaleString("es-MX")}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center py-4 px-6 border-t border-dashed border-gray-200 bg-stone-50">
                  <p className="text-xs text-gray-500">¡Gracias por reservar con Alebrijes!</p>
                  <p className="text-xs text-gray-400 mt-0.5">Presenta este comprobante al llegar al destino</p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-3 no-print mt-2">
                {metodoPago === "llegando" && (
                  <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3">
                    <img src={iconEfectivo} alt="efectivo" className="w-7 h-7 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-teal-600">Pago en destino</p>
                      <p className="text-xs text-gray-400">Recibirás tus boletos físicos al llegar al lugar.</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  {metodoPago === "tarjeta" && (
                    <button
                      onClick={handleDescargar}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm px-5 py-2 rounded-xl shadow-sm hover:shadow-md hover:from-teal-600 hover:to-teal-700 transition-all duration-150 active:scale-95"
                    >
                      <img src={iconDescarga} alt="descargar" className="w-4 h-4 invert" />
                      Descargar PDF
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/")}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-gray-600 border border-gray-200 font-semibold text-sm px-5 py-2 rounded-xl shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-150 active:scale-95"
                  >
                    ← Volver al inicio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Resumen;
