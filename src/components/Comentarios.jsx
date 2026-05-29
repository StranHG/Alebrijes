import { useState, useEffect } from "react";
import iconComentarios from "../assets/comentarios.png";
import iconLike from "../assets/Like.png";

const inputClass = "w-full border border-gray-200 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-teal-400 resize-none bg-white text-gray-800 placeholder-gray-400";

function Estrella({ llena, onClick }) {
  return (
    <span
      onClick={onClick}
      className="text-3xl cursor-pointer transition"
      style={{ color: llena ? "#0d9488" : "#e5e7eb" }}
    >
      ★
    </span>
  );
}

function Comentarios({ lugarId }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [comentarios, setComentarios] = useState([]);
  const [calificacion, setCalificacion] = useState(0);
  const [texto, setTexto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost/alebrijes/comentarios.php?lugar_id=${lugarId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setComentarios(data.comentarios);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [lugarId]);

  const handleEnviar = async () => {
    if (!usuario) { setMensaje("⚠️ Debes iniciar sesión para comentar"); return; }
    if (calificacion === 0) { setMensaje("⚠️ Selecciona una calificación"); return; }
    if (texto.trim() === "") { setMensaje("⚠️ Escribe un comentario"); return; }

    const res = await fetch("http://localhost/alebrijes/comentarios.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lugar_id: lugarId, usuario_id: usuario.id, calificacion, texto }),
    });
    const data = await res.json();
    if (data.success) {
      const nuevo = {
        id: data.id,
        usuario_nombre: usuario.nombre,
        calificacion,
        texto,
        created_at: new Date().toISOString(),
      };
      setComentarios([nuevo, ...comentarios]);
      setCalificacion(0);
      setTexto("");
      setMensaje("Comentario publicado");
      setTimeout(() => setMensaje(""), 3000);
    } else {
      setMensaje("Error al publicar, intenta de nuevo");
    }
  };

  const promedio = comentarios.length
    ? (comentarios.reduce((sum, c) => sum + c.calificacion, 0) / comentarios.length).toFixed(1)
    : 0;

  const formatFecha = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-2">
        <img src={iconComentarios} alt="opiniones" className="w-8 h-8" />
        <h2 className="text-2xl font-bold text-gray-800">Opiniones</h2>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <img src={iconLike} alt="like" className="w-5 h-5" />
        <p className="text-gray-600">
          Calificación promedio:{" "}
          <span className="text-teal-500 font-bold text-xl">{promedio}</span> / 5
          &nbsp;({comentarios.length} reseñas)
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 shadow mb-6">
        <h3 className="text-lg font-bold text-teal-500 mb-3">Deja tu opinión</h3>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Estrella key={i} llena={i <= calificacion} onClick={() => setCalificacion(i)} />
          ))}
        </div>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="¿Cómo fue tu experiencia?"
          rows={3}
          className={inputClass}
        />
        <button
          onClick={handleEnviar}
          className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-teal-600 transition"
        >
          Publicar comentario
        </button>
        {mensaje && <p className="mt-3 text-sm text-gray-600">{mensaje}</p>}
      </div>

      {/* Lista */}
      {cargando ? (
        <p className="text-gray-600 text-center py-6">Cargando opiniones...</p>
      ) : comentarios.length === 0 ? (
        <p className="text-gray-600 text-center py-6">Sé el primero en opinar sobre este lugar.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {comentarios.map((c) => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-800">{c.usuario_nombre}</p>
                  <p className="text-sm text-gray-400">{formatFecha(c.created_at)}</p>
                </div>
                <div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} style={{ color: i <= c.calificacion ? "#0d9488" : "#e5e7eb" }}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{c.texto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Comentarios;
