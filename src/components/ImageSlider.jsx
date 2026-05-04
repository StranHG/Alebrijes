import { useState } from "react";

function ImageSlider({ imagenes, nombre }) {
  const [actual, setActual] = useState(0);

  const anterior = () => {
    setActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const siguiente = () => {
    setActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-white">
      <img
        src={imagenes[actual]}
        alt={nombre}
        className="w-full h-96 object-cover"
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6">
        <button
          onClick={anterior}
          className="bg-black bg-opacity-50 text-white text-2xl px-4 py-2 rounded-full hover:bg-opacity-80 transition"
        >
          ◀
        </button>
        <span className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
          {actual + 1} / {imagenes.length}
        </span>
        <button
          onClick={siguiente}
          className="bg-black bg-opacity-50 text-white text-2xl px-4 py-2 rounded-full hover:bg-opacity-80 transition"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

export default ImageSlider;