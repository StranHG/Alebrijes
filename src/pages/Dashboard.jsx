import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useState, useEffect } from "react";
import iconLupa from "../assets/lupa.png";
import iconNoEncontrado from "../assets/no_encontrado.png";

function Dashboard() {
  const [busqueda, setBusqueda] = useState("");
  const [lugares, setLugares] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost/alebrijes/pueblos.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLugares(data.pueblos);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const filtrados = lugares.filter((l) =>
    l.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="bg-white border-b border-teal-100 text-center py-16 px-8">
        <h1 className="text-5xl font-bold text-teal-500 mb-2">Alebrijes</h1>
        <p className="text-gray-500 text-xl mb-8">Explora los Pueblos Mágicos y vive experiencias únicas</p>
        <div className="max-w-md mx-auto relative">
          <img src={iconLupa} alt="buscar" className="absolute left-4 top-3.5 w-5 h-5 opacity-50" />
          <input
            type="text"
            placeholder="Busca un pueblo mágico..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-teal-200 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-400 shadow-sm text-lg"
          />
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {busqueda ? `Resultados para "${busqueda}"` : "Pueblos Mágicos de Oaxaca"}
        </h2>

        {cargando ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">⏳</p>
            <p className="text-gray-500 text-xl">Cargando pueblos...</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-16">
            <img src={iconNoEncontrado} alt="no encontrado" className="w-24 h-24 mx-auto mb-4 opacity-60" />
            <p className="text-gray-500 text-xl">No encontramos ese pueblo mágico</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map((lugar) => (
              <Card
                key={lugar.id}
                {...lugar}
                imagen={(() => {
                  try {
                    const imgs = JSON.parse(lugar.imagen_url);
                    return Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : "https://placehold.co/400x200/0d9488/white?text=Sin+imagen";
                  } catch {
                    return lugar.imagen_url || "https://placehold.co/400x200/0d9488/white?text=Sin+imagen";
                  }
                })()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
