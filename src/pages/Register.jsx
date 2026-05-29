import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import fondoRegister from "../assets/log.jpg";
import iconAlebrije from "../assets/alebrije.png";
import iconVision from "../assets/vision.png";

function Register() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "" });
  const [errores, setErrores] = useState({});
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const navigate = useNavigate();

  const guardarSesion = (usuario) => {
    localStorage.setItem("auth", "true");
    localStorage.setItem("usuario", JSON.stringify(usuario));
    navigate("/");
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim() || form.nombre.trim().length < 3) errs.nombre = "El nombre debe tener al menos 3 caracteres";
    if (!form.email.trim()) errs.email = "Ingresa tu correo";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Correo no válido";
    if (!form.password) errs.password = "Ingresa una contraseña";
    else if (form.password.length < 6) errs.password = "Mínimo 6 caracteres";
    if (!form.confirmar) errs.confirmar = "Confirma tu contraseña";
    else if (form.password !== form.confirmar) errs.confirmar = "Las contraseñas no coinciden";
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validar()) return;
    try {
      const response = await fetch("http://localhost/alebrijes/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password }),
      });
      const data = await response.json();
      if (data.success) guardarSesion(data.usuario);
      else setMensajeGlobal(data.mensaje);
    } catch {
      setMensajeGlobal("Error al conectar con el servidor");
    }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      const response = await fetch("http://localhost/alebrijes/google_auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await response.json();
      if (data.success) guardarSesion(data.usuario);
      else setMensajeGlobal(data.mensaje || "Error al continuar con Google");
    } catch {
      setMensajeGlobal("Error al conectar con el servidor");
    }
  };

  const campo = (key) => ({
    onChange: (e) => { setForm({ ...form, [key]: e.target.value }); setErrores((p) => ({ ...p, [key]: "" })); },
  });

  const inputBase = "w-full bg-white/20 text-white placeholder-white/60 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/30 transition";

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${fondoRegister})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-6">
          <img src={iconAlebrije} alt="alebrije" className="w-16 h-16 mx-auto mb-2 drop-shadow-lg" />
          <h1 className="text-3xl font-bold text-teal-400">Crear cuenta</h1>
          <p className="text-white/70 text-sm mt-1">Únete a Alebrijes</p>
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Nombre completo"
            value={form.nombre}
            className={`${inputBase} ${errores.nombre ? "border-red-400/60" : "border-white/30"}`}
            {...campo("nombre")}
          />
          {errores.nombre && <p className="text-red-300 text-xs mb-1">{errores.nombre}</p>}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            className={`${inputBase} mt-2 ${errores.email ? "border-red-400/60" : "border-white/30"}`}
            {...campo("email")}
          />
          {errores.email && <p className="text-red-300 text-xs mb-1">{errores.email}</p>}

          <div className="relative mt-2">
            <input
              type={verPassword ? "text" : "password"}
              placeholder="Contraseña (mín. 6 caracteres)"
              value={form.password}
              className={`${inputBase} pr-12 ${errores.password ? "border-red-400/60" : "border-white/30"}`}
              {...campo("password")}
            />
            <button type="button" onClick={() => setVerPassword(!verPassword)} className="absolute right-3 top-3 text-white/60 hover:text-white transition text-lg">
              <img src={iconVision} alt="ver" className={`w-5 h-5 transition ${verPassword ? "opacity-100" : "opacity-50"}`} style={{ filter: "invert(1)" }} />
            </button>
          </div>
          {errores.password && <p className="text-red-300 text-xs mb-1">{errores.password}</p>}

          <div className="relative mt-2">
            <input
              type={verConfirmar ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={form.confirmar}
              className={`${inputBase} pr-12 ${errores.confirmar ? "border-red-400/60" : "border-white/30"}`}
              {...campo("confirmar")}
            />
            <button type="button" onClick={() => setVerConfirmar(!verConfirmar)} className="absolute right-3 top-3 text-white/60 hover:text-white transition text-lg">
              <img src={iconVision} alt="ver" className={`w-5 h-5 transition ${verConfirmar ? "opacity-100" : "opacity-50"}`} style={{ filter: "invert(1)" }} />
            </button>
          </div>
          {errores.confirmar && <p className="text-red-300 text-xs">{errores.confirmar}</p>}
        </div>

        {mensajeGlobal && <p className="text-red-300 text-sm text-center mt-3">{mensajeGlobal}</p>}

        <button
          onClick={handleRegister}
          className="w-full mt-5 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition shadow-lg"
        >
          Crear cuenta
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/50 text-xs">o continúa con</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setMensajeGlobal("Error al continuar con Google")}
            theme="filled_black"
            shape="pill"
            text="signup_with"
            locale="es"
          />
        </div>

        <p className="text-center mt-5 text-white/60 text-sm">
          ¿Ya tienes cuenta?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-teal-400 cursor-pointer font-semibold hover:text-teal-300"
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
