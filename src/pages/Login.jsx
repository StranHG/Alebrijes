import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

const handleLogin = async () => {
  console.log("handleLogin ejecutado");
  
  if (email === "" || password === "") {
    setMensaje("⚠️ Completa todos los campos");
    return;
  }

  console.log("Mandando fetch a PHP...");

  try {
    const response = await fetch("http://localhost/alebrijes/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Respuesta recibida:", response);
    const data = await response.json();
    console.log("Data:", data);

   if (data.success) {
  localStorage.setItem("auth", "true");
  localStorage.setItem("usuario", JSON.stringify(data.usuario));

  if (data.usuario.rol === "admin") {
    navigate("/admin");
  } else {
    navigate("/");
  }
} 
  } catch (error) {
    console.log("Error:", error);
    setMensaje("❌ Error al conectar con el servidor");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <Input
          type="email"
          placeholder="Correo"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button text="Iniciar sesión" onClick={handleLogin} />

        <p className="text-center mt-4 text-gray-600">{mensaje}</p>

        <p className="text-center mt-4 text-gray-400 text-sm">
  ¿No tienes cuenta?{" "}
  <span onClick={() => navigate("/register")} className="text-orange-500 cursor-pointer font-semibold">
    Regístrate
  </span>
</p>
      </div>
    </div>
  );
}

export default Login;