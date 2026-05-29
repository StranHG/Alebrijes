import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import ImageSlider from "../components/ImageSlider";
import CardEmpresa from "../components/CardEmpresa";
import Comentarios from "../components/Comentarios";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lugar, setLugar] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost/alebrijes/pueblos.php").then((r) => r.json()),
      fetch(`http://localhost/alebrijes/empresas.php?pueblo_id=${id}`).then((r) => r.json()),
    ])
      .then(([pueblosData, empresasData]) => {
        if (pueblosData.success) {
          const encontrado = pueblosData.pueblos.find((p) => String(p.id) === String(id));
          setLugar(encontrado || null);
        }
        if (empresasData.success) setEmpresas(empresasData.empresas);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [id]);

  if (cargando) return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="text-center py-16">
        <p className="text-5xl mb-4">⏳</p>
        <p className="text-gray-600 text-xl">Cargando...</p>
      </div>
    </div>
  );

  if (!lugar) return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <p className="text-center mt-10">Lugar no encontrado.</p>
    </div>
  );

  let imagenes;
  try {
    const parsed = JSON.parse(lugar.imagen_url);
    imagenes = Array.isArray(parsed) && parsed.length > 0 ? parsed : ["https://placehold.co/800x400/f97316/white?text=Sin+imagen"];
  } catch {
    imagenes = lugar.imagen_url ? [lugar.imagen_url] : ["https://placehold.co/800x400/f97316/white?text=Sin+imagen"];
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-teal-500 mb-2">{lugar.nombre}</h1>
        <p className="text-gray-600 text-lg mb-8">{lugar.descripcion}</p>

        <div className="flex gap-8">
          <div className="w-3/5">
            <ImageSlider imagenes={imagenes} nombre={lugar.nombre} />

            {/* Mapa */}
            <div className="mt-6 rounded-2xl overflow-hidden border border-teal-100 shadow-sm">
              <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700"> Ubicación</span>
                <span className="text-xs text-gray-400">{lugar.nombre}, Oaxaca</span>
              </div>
              <iframe
                title="mapa"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${encodeURIComponent(lugar.nombre + ", Oaxaca, México")}&output=embed`}
              />
            </div>
          </div>

          <div className="w-2/5">
            <h2 className="text-2xl font-bold text-teal-500 mb-4">Empresas de Tours</h2>
            {empresas.length === 0 ? (
              <p className="text-gray-600">Aún no hay empresas registradas para este pueblo.</p>
            ) : (
              empresas.map((empresa) => (
                <CardEmpresa
                  key={empresa.id}
                  {...empresa}
                  onClick={() => navigate(`/empresa/${empresa.id}`)}
                />
              ))
            )}
          </div>
        </div>

        <div className="mt-8">
          <Comentarios lugarId={lugar.id} />
          <Button text="← Regresar" onClick={() => navigate("/")} variant="ghost" fullWidth={false} />
        </div>
      </div>
    </div>
  );
}

export default Detail;
