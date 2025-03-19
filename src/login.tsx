import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css"; // ✅ Importar estilos

export default function Login() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();


  const handleDniBlur = async () => {
    if (!dni) return;
    try {
      console.log("🔍 Verificando si el usuario existe:", dni);
      const response = await axios.get(`http://localhost:3000/usuarios/${dni}`);

      if (response.data.error) {
        console.log("❌ Usuario NO encontrado, debe registrarse.");
        setIsNewUser(true); 
      } else {
        console.log("✅ Usuario encontrado, debe iniciar sesión.");
        setIsNewUser(false);
      }
    } catch (error) {
      console.error("❌ Error al verificar el usuario:", error);
      setIsNewUser(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!dni) {
      alert("El DNI es obligatorio.");
      return;
    }

    try {
      if (isNewUser) {
        if (password !== confirmPassword) {
          alert("Las contraseñas no coinciden.");
          return;
        }
        console.log("🆕 Registrando usuario...");
        const response = await axios.post("http://localhost:3000/usuarios/register", {
          identificacion: dni,
          password,
        });

        if (response.data.error) {
          alert("Error: " + response.data.error);
          return;
        }

        console.log("✅ Usuario registrado correctamente.");
      } else {
        console.log("🔑 Iniciando sesión...");
        const response = await axios.post("http://localhost:3000/usuarios/login", {
          identificacion: dni,
          password,
        });

        if (response.data.error) {
          alert("DNI o contraseña incorrecta.");
          return;
        }
      }

      localStorage.setItem("identificacion", dni); 
      navigate(`/formulario/${dni}`);
    } catch (error) {
      console.error("❌ Error en el login/registro:", error);
      alert("Hubo un error en la autenticación.");
    }
  };

  return (
    <div className="container">
      <h2>{isNewUser ? "Registro" : "Iniciar sesión"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          onBlur={handleDniBlur}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isNewUser && (
          <input
            type="password"
            placeholder="Repetir Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button type="submit">{isNewUser ? "Registrarse" : "Ingresar"}</button>
      </form>
    </div>
  );
}
