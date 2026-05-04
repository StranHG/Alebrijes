import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import ImageSlider from "../components/ImageSlider";
import CardEmpresa from "../components/CardEmpresa";

import huautla from "../assets/huautla.jpg";
import sanpablo from "../assets/sanpablo.jpg";
import capulalpam from "../assets/capulalpam.jpg";
import sanmartin from "../assets/sanmartin.jpg";
import mazunte from "../assets/mazunte.jpg";
import hierve from "../assets/hierve.jpg";
import Comentarios from "../components/Comentarios";

const lugares = [
  {
    id: 1,
    nombre: "Huautla de Jiménez",
    descripcion: "Famoso por su cultura mazateca y el uso ceremonial de hongos sagrados. Un destino espiritual único en México.",
    imagenes: [huautla, huautla, huautla, huautla],
    empresas: [
      { id: 1, nombre: "Tours Mazateca", direccion: "Calle Principal #12, Huautla", rfc: "TMA123456ABC" },
      { id: 2, nombre: "Viajes Sierra Norte", direccion: "Av. Benito Juárez #45, Huautla", rfc: "VSN789012DEF" },
      { id: 3, nombre: "Expediciones Oaxaca", direccion: "Calle Morelos #8, Huautla", rfc: "EOA345678GHI" },
    ],
  },
  {
    id: 2,
    nombre: "San Pablo Villa de Etla",
    descripcion: "Hogar de la zona arqueológica de Mitla, con impresionantes mosaicos de piedra únicos en Mesoamérica.",
    imagenes: [sanpablo, sanpablo, sanpablo, sanpablo],
    empresas: [
      { id: 1, nombre: "Tours Mitla", direccion: "Calle Hidalgo #5, San Pablo", rfc: "TMI111222AAA" },
      { id: 2, nombre: "Aventuras Zapotecas", direccion: "Av. Independencia #22, San Pablo", rfc: "AZA333444BBB" },
    ],
  },
  {
    id: 3,
    nombre: "Capulálpam de Méndez",
    descripcion: "Un pueblo serrano rodeado de bosques, ideal para el ecoturismo y el turismo comunitario.",
    imagenes: [capulalpam, capulalpam, capulalpam, capulalpam],
    empresas: [
      { id: 1, nombre: "Ecoturismo Sierra Juárez", direccion: "Calle Juárez #3, Capulálpam", rfc: "ESJ555666CCC" },
      { id: 2, nombre: "Bosques de Oaxaca", direccion: "Av. Principal #17, Capulálpam", rfc: "BOA777888DDD" },
      { id: 3, nombre: "Turismo Comunitario", direccion: "Calle Reforma #9, Capulálpam", rfc: "TCA999000EEE" },
    ],
  },
  {
    id: 4,
    nombre: "San Martín Tilcajete",
    descripcion: "La capital mundial de los alebrijes de madera, figuras fantásticas talladas y pintadas a mano.",
    imagenes: [sanmartin, sanmartin, sanmartin, sanmartin],
    empresas: [
      { id: 1, nombre: "Alebrijes Tours", direccion: "Calle Artesanos #1, San Martín", rfc: "ATO123789JJJ" },
      { id: 2, nombre: "Magia Zapoteca", direccion: "Av. Central #33, San Martín", rfc: "MZA456012KKK" },
    ],
  },
  {
    id: 5,
    nombre: "Mazunte",
    descripcion: "Pueblo costero con tortugario, cosmética natural y playas tranquilas en la costa oaxaqueña.",
    imagenes: [mazunte, mazunte, mazunte, mazunte],
    empresas: [
      { id: 1, nombre: "Tours Costa Oaxaca", direccion: "Playa Principal s/n, Mazunte", rfc: "TCO789345LLL" },
      { id: 2, nombre: "Mar y Sierra", direccion: "Calle del Mar #7, Mazunte", rfc: "MYS012678MMM" },
      { id: 3, nombre: "Ecotur Mazunte", direccion: "Av. Tortugario #2, Mazunte", rfc: "EMA345901NNN" },
    ],
  },
  {
    id: 6,
    nombre: "Hierve el Agua",
    descripcion: "Cascadas petrificadas que parecen congeladas en el tiempo, con albercas naturales y vistas increíbles.",
    imagenes: [hierve, hierve, hierve, hierve],
    empresas: [
      { id: 1, nombre: "Tours Hierve", direccion: "Carretera Principal km 5, Hierve", rfc: "THI678234OOO" },
      { id: 2, nombre: "Aventura Natural", direccion: "Calle Cascadas #4, Hierve", rfc: "ANA901567PPP" },
    ],
  },
];

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lugar = lugares.find((l) => l.id === parseInt(id));

  if (!lugar) return <p className="text-center mt-10">Lugar no encontrado.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{lugar.nombre}</h1>
        <p className="text-gray-500 text-lg mb-8">{lugar.descripcion}</p>

        <div className="flex gap-8">
          {/* Izquierda - Slider de imágenes */}
          <div className="w-3/5">
            <ImageSlider imagenes={lugar.imagenes} nombre={lugar.nombre} />
          </div>

          {/* Derecha - Lista de empresas */}
          <div className="w-2/5">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">🧭 Empresas de Tours</h2>
            {lugar.empresas.map((empresa) => (
              <CardEmpresa
                key={empresa.id}
                {...empresa}
                onClick={() => navigate(`/empresa/${empresa.id}`)}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Comentarios lugarId={lugar.id} />
          <Button text="← Regresar" onClick={() => navigate("/dashboard")} />
        </div>
      </div>
    </div>
  );
}

export default Detail;