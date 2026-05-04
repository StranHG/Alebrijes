import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

function Register() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "" });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!form.nombre || !form.email || !form.password || !form.confirmar) {
      setMensaje("⚠️ Completa todos los campos");
      return;
    }
    if (form.password !== form.confirmar) {
      setMensaje("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost/alebrijes/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth", "true");
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        navigate("/");
      } else {
        setMensaje("❌ " + data.mensaje);
      }
    } catch (error) {
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Crear cuenta</h1>
        <p className="text-center text-gray-400 mb-6 text-sm">Únete a Alebrijes</p>

        <Input placeholder="Nombre completo" onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <Input type="email" placeholder="Correo electrónico" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input type="password" placeholder="Contraseña" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Input type="password" placeholder="Confirmar contraseña" onChange={(e) => setForm({ ...form, confirmar: e.target.value })} />

        <Button text="Crear cuenta" onClick={handleRegister} />

        <p className="text-center mt-4 text-gray-400 text-sm">
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => navigate("/login")} className="text-orange-500 cursor-pointer font-semibold">
            Inicia sesión
          </span>
        </p>

        {mensaje && <p className="text-center mt-4 text-gray-600">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Register;