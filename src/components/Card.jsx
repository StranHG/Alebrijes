import { useNavigate } from "react-router-dom";

function Card({ id, nombre, descripcion, imagen }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lugar/${id}`)}
      className="cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-white hover:scale-105 transition-transform duration-300"
    >
      <img src={imagen} alt={nombre} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{nombre}</h2>
        <p className="text-gray-500 text-sm mt-1">{descripcion}</p>
      </div>
    </div>
  );
}

export default Card;