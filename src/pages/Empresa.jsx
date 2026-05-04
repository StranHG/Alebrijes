import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import CardActividad from "../components/CardActividad";
import ModalLogin from "../components/ModalLogin";

const empresaData = {
  id: 1,
  nombre: "Tours Mazateca",
  direccion: "Calle Principal #12, Huautla",
  rfc: "TMA123456ABC",
  telefono: "951 123 4567",
  actividades: [
    { id: 1, nombre: "Caminata al cerro sagrado", descripcion: "Recorrido guiado por senderos con vista panorámica.", hora_inicio: "9:00 AM", hora_fin: "11:00 AM", costo: 350 },
    { id: 2, nombre: "Tour ceremonial mazateco", descripcion: "Experiencia cultural con guía local certificado.", hora_inicio: "11:00 AM", hora_fin: "1:00 PM", costo: 800 },
    { id: 3, nombre: "Visita a cascadas", descripcion: "Exploración de cascadas naturales en la sierra.", hora_inicio: "9:00 AM", hora_fin: "12:00 PM", costo: 500 },
    { id: 4, nombre: "Taller de medicina tradicional", descripcion: "Aprende sobre plantas medicinales mazatecas.", hora_inicio: "2:00 PM", hora_fin: "4:00 PM", costo: 250 },
  ],
};

function horasConflictan(act1, act2) {
  const toMinutos = (hora) => {
    const [time, period] = hora.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const inicio1 = toMinutos(act1.hora_inicio);
  const fin1 = toMinutos(act1.hora_fin);
  const inicio2 = toMinutos(act2.hora_inicio);
  const fin2 = toMinutos(act2.hora_fin);

  return inicio1 < fin2 && inicio2 < fin1;
}

function Empresa() {
  const navigate = useNavigate();
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleSeleccionar = (id, dia, personas) => {
  if (!usuario) {
    setMostrarModal(true);
    return;
  }

  const actividad = empresaData.actividades.find((a) => a.id === id);

  if (seleccionadas.find((a) => a.id === id)) {
    setSeleccionadas(seleccionadas.filter((a) => a.id !== id));
    return;
  }

  if (!dia) {
    alert("⚠️ Selecciona un día para esta actividad");
    return;
  }

  const conflicto = seleccionadas.some((sel) => horasConflictan(sel, actividad));
  if (conflicto) {
    alert("⚠️ Ya tienes una actividad en ese horario, elige otra hora.");
    return;
  }

  setSeleccionadas([...seleccionadas, { ...actividad, dia, personas, totalActividad: actividad.costo * personas }]);
};

  const estaDeshabilitada = (actividad) => {
    if (seleccionadas.find((a) => a.id === actividad.id)) return false;
    return seleccionadas.some((sel) => horasConflictan(sel, actividad));
  };

   const total = seleccionadas.reduce((sum, a) => sum + a.totalActividad, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">

        {/* Info empresa */}
        <div className="bg-white rounded-2xl p-6 shadow mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{empresaData.nombre}</h1>
          <p className="text-gray-500">📍 {empresaData.direccion}</p>
          <p className="text-gray-400 text-sm">RFC: {empresaData.rfc}</p>
          <p className="text-gray-500 mt-1">📞 {empresaData.telefono}</p>
        </div>

        {/* Actividades */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">🧗 Actividades disponibles</h2>
        {empresaData.actividades.map((actividad) => (
          <CardActividad
            key={actividad.id}
            {...actividad}
            seleccionada={!!seleccionadas.find((a) => a.id === actividad.id)}
            deshabilitada={estaDeshabilitada(actividad)}
            onSeleccionar={handleSeleccionar}
          />
        ))}

        {/* Botón pagar */}
        {seleccionadas.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow mt-6">
            <p className="text-gray-600 mb-1">
              {seleccionadas.length} actividad(es) seleccionada(s)
            </p>
            <p className="text-2xl font-bold text-orange-500 mb-4">
              Total: ${total}
            </p>
            <Button
              text="Pagar boletos →"
              onClick={() =>
                navigate("/resumen", {
                  state: {
                    actividades: seleccionadas,
                    total,
                    empresa: empresaData.nombre,
                  },
                })
              }
            />
          </div>
        )}

        <div className="mt-6">
          <Button text="← Regresar" onClick={() => navigate(-1)} />
        </div>

        {mostrarModal && <ModalLogin onCerrar={() => setMostrarModal(false)} />}
      </div>
    </div>
  );
}

export default Empresa;