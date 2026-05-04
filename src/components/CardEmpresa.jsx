function CardEmpresa({ nombre, direccion, rfc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl p-4 shadow hover:shadow-md hover:scale-105 transition-transform duration-200 mb-4"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🏢</span>
        <h3 className="text-lg font-bold text-gray-800">{nombre}</h3>
      </div>
      <p className="text-sm text-gray-500">📍 {direccion}</p>
      <p className="text-sm text-gray-400">RFC: {rfc}</p>
    </div>
  );
}

export default CardEmpresa;