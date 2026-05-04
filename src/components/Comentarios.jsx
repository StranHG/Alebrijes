import { useState } from "react";

function Estrella({ llena, onClick }) {
  return (
    <span
      onClick={onClick}
      className="text-3xl cursor-pointer transition"
      style={{ color: llena ? "#f97316" : "#d1d5db" }}
    >
      ★
    </span>
  );
}

function Comentarios({ lugarId }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [comentarios, setComentarios] = useState([
    { id: 1, nombre: "María López", calificacion: 5, texto: "¡Increíble lugar! Los paisajes son espectaculares y la gente muy amable.", fecha: "12 Abr 2026" },
    { id: 2, nombre: "Carlos Ruiz", calificacion: 4, texto: "Muy bonito pueblo, la experiencia cultural fue única. Definitivamente regresaría.", fecha: "28 Mar 2026" },
    { id: 3, nombre: "Ana Martínez", calificacion: 5, texto: "Una experiencia que no olvidaré. La comida típica es deliciosa.", fecha: "15 Mar 2026" },
  ]);

  const [calificacion, setCalificacion] = useState(0);
  const [texto, setTexto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleEnviar = () => {
    if (!usuario) {
      setMensaje("⚠️ Debes iniciar sesión para comentar");
      return;
    }
    if (calificacion === 0) {
      setMensaje("⚠️ Selecciona una calificación");
      return;
    }
    if (texto.trim() === "") {
      setMensaje("⚠️ Escribe un comentario");
      return;
    }

    const nuevo = {
      id: Date.now(),
      nombre: usuario.nombre,
      calificacion,
      texto,
      fecha: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }),
    };

    setComentarios([nuevo, ...comentarios]);
    setCalificacion(0);
    setTexto("");
    setMensaje("✅ Comentario publicado");
    setTimeout(() => setMensaje(""), 3000);
  };

  const promedio = comentarios.length
    ? (comentarios.reduce((sum, c) => sum + c.calificacion, 0) / comentarios.length).toFixed(1)
    : 0;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-2">⭐ Opiniones</h2>
      <p className="text-gray-400 mb-6">
        Calificación promedio: <span className="text-orange-500 font-bold text-xl">{promedio}</span> / 5
        ({comentarios.length} reseñas)
      </p>

      {/* Formulario */}
      <div className="bg-white rounded-2xl p-6 shadow mb-6">
        <h3 className="text-lg font-bold text-gray-700 mb-3">Deja tu opinión</h3>

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
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />

        <button
          onClick={handleEnviar}
          className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Publicar comentario
        </button>

        {mensaje && <p className="mt-3 text-sm text-gray-500">{mensaje}</p>}
      </div>

      {/* Lista de comentarios */}
      <div className="flex flex-col gap-4">
        {comentarios.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl p-5 shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-gray-800">{c.nombre}</p>
                <p className="text-sm text-gray-400">{c.fecha}</p>
              </div>
              <div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} style={{ color: i <= c.calificacion ? "#f97316" : "#d1d5db" }}>★</span>
                ))}
              </div>
            </div>
            <p className="text-gray-600">{c.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comentarios;