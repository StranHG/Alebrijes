import { Navigate } from "react-router-dom";

function RutaAdmin({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || usuario.rol !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default RutaAdmin;