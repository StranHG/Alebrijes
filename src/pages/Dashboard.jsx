import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("auth");
            navigate("/");
          }}
          className="bg-red-500 text-white px-6 py-3 rounded-lg"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;