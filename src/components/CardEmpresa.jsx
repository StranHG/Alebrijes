import iconUbicacion from "../assets/puntoDeEncuentro.png";

function CardEmpresa({ nombre, direccion, rfc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white border border-teal-100 shadow-sm rounded-2xl p-4 shadow hover:border-teal-500/60 hover:scale-105 transition-all duration-200 mb-4"
    >
      <h3 className="text-lg font-bold text-teal-500 mb-2">{nombre}</h3>
      <div className="flex items-center gap-2">
        <img src={iconUbicacion} alt="ubicación" className="w-4 h-4" />
        <p className="text-sm text-gray-500">{direccion}</p>
      </div>
      <p className="text-xs text-gray-500 mt-1 ml-6">RFC: {rfc}</p>
    </div>
  );
}

export default CardEmpresa;
