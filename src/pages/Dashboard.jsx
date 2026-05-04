import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useState } from "react";

import huautla from "../assets/huautla.jpg";
import sanpablo from "../assets/sanpablo.jpg";
import capulalpam from "../assets/capulalpam.jpg";
import sanmartin from "../assets/sanmartin.jpg";
import mazunte from "../assets/mazunte.jpg";
import hierve from "../assets/hierve.jpg";

const lugares = [
  { id: 1, nombre: "Huautla de Jiménez", descripcion: "Cultura mazateca y hongos sagrados.", imagen: huautla },
  { id: 2, nombre: "San Pablo Villa de Etla", descripcion: "Zona arqueológica de Mitla.", imagen: sanpablo },
  { id: 3, nombre: "Capulálpam de Méndez", descripcion: "Ecoturismo en la Sierra Juárez.", imagen: capulalpam },
  { id: 4, nombre: "San Martín Tilcajete", descripcion: "Capital de los alebrijes de madera.", imagen: sanmartin },
  { id: 5, nombre: "Mazunte", descripcion: "Pueblo costero con tortugario.", imagen: mazunte },
  { id: 6, nombre: "Hierve el Agua", descripcion: "Cascadas petrificadas únicas en el mundo.", imagen: hierve },
];

function Dashboard() {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = lugares.filter((l) =>
    l.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Hero */}
      <div className="bg-orange-500 text-white text-center py-16 px-8">
        <h1 className="text-5xl font-bold mb-4">🐉 Descubre Oaxaca</h1>
        <p className="text-xl opacity-90 mb-8">Explora los Pueblos Mágicos y vive experiencias únicas</p>

        {/* Buscador */}
        <div className="max-w-md mx-auto relative">
          <span className="absolute left-4 top-3 text-orange-400 text-xl">🔍</span>
          <input
            type="text"
            placeholder="Busca un pueblo mágico..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 outline-none shadow-lg text-lg"
          />
        </div>
      </div>

      {/* Grid de tarjetas */}
      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-700 mb-6">
          {busqueda ? `Resultados para "${busqueda}"` : "Pueblos Mágicos de Oaxaca"}
        </h2>

        {filtrados.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">😕</p>
            <p className="text-gray-500 text-xl">No encontramos ese pueblo mágico</p>
            <p className="text-gray-400 mt-2">Intenta con otro nombre</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map((lugar) => (
              <Card key={lugar.id} {...lugar} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;