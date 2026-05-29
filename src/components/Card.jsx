import { useNavigate } from "react-router-dom";

function Card({ id, nombre, descripcion, imagen }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lugar/${id}`)}
      className="cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative h-52 bg-gray-200">
        {imagen && (
          <img
            src={imagen}
            alt={nombre}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h2 className="text-xl font-bold text-white drop-shadow-lg">{nombre}</h2>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-teal-100">
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{descripcion}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-teal-600 font-semibold bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Pueblo Mágico
          </span>
          <span className="text-teal-500 text-sm font-semibold group-hover:translate-x-1 transition-transform">
            Ver más →
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
