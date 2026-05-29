import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Detail from "./pages/Detail";
import Empresa from "./pages/Empresa";
import Resumen from "./pages/Resumen";
import Admin from "./pages/Admin";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import RutaAdmin from "./components/RutaAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lugar/:id" element={<Detail />} />
        <Route path="/empresa/:id" element={<Empresa />} />
        <Route path="/resumen" element={<Resumen />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route
          path="/admin"
          element={
            <RutaAdmin>
              <Admin />
            </RutaAdmin>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;