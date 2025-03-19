import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./styles.css"; // ✅ Importar estilos

export default function Formulario() {
    const { dni } = useParams<{ dni: string }>(); // 📌 Obtener dni de la URL

    const [formData, setFormData] = useState({
        nombreCompleto: "",
        identificacion: "",
        edad: "",
        genero: "",
        estado: true,
        maneja: false,
        usaLentes: false,
        diabetico: false,
        otraEnfermedad: "",
    });

    const [hasData, setHasData] = useState(false);

    // 📌 Cuando `dni` cambie, actualizar `identificacion`
    useEffect(() => {
        if (dni) {
            setFormData((prev) => ({ ...prev, identificacion: dni }));
        }
    }, [dni]);

    useEffect(() => {
        if (!dni) return;

        axios.get(`http://localhost:3000/personas/${dni}`)
            .then((res) => {
                if (res.data && !res.data.error) {
                    setFormData(res.data);
                    setHasData(true);
                } else {
                    setHasData(false);
                }
            })
            .catch((error) => {
                console.error("❌ Error al verificar los datos personales:", error);
                setHasData(false);
            });
    }, [dni]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        let newValue: any = value;
    
        if (type === "checkbox") {
            newValue = (e.target as HTMLInputElement).checked; // ✅ Convertir checkbox a boolean
        } else if (name === "edad") {
            newValue = parseInt(value, 10) || ""; // ✅ Convertir edad a número
        }
    
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("📩 Enviando datos al backend:", JSON.stringify(formData, null, 2));

        if (!formData.identificacion) {
            alert("Error: La identificación es obligatoria.");
            return;
        }

        try {
            await axios.post("http://localhost:3000/personas", formData);
            alert("Datos guardados correctamente");
            setHasData(true);
        } catch (error) {
            console.error("❌ Error al enviar el formulario", error);
            alert("Hubo un error al enviar los datos.");
        }
    };

    // 📌 Eliminar usuario de ambas tablas
    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar tu usuario? Esta acción es irreversible.")) {
            return;
        }
        try {
            await axios.delete(`http://localhost:3000/usuarios/${dni}`); // ✅ Elimina en backend
            alert("Usuario eliminado correctamente.");
            window.location.href = "/"; // Redirigir al login
        } catch (error) {
            console.error("❌ Error al eliminar usuario:", error);
            alert("Hubo un error al eliminar el usuario.");
        }
    };

    return (
        <div className="container">
            <h2>{hasData ? "Modificar datos" : "Registro de Persona"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombreCompleto"
                    placeholder="Nombre Completo"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="identificacion"
                    placeholder="Identificación"
                    value={formData.identificacion}
                    onChange={handleChange}
                    readOnly={hasData}
                />
                <input
                    type="number"
                    name="edad"
                    placeholder="Edad"
                    value={formData.edad}
                    onChange={handleChange}
                />
                <select name="genero" value={formData.genero} onChange={handleChange}>
                    <option value="">Seleccione género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                </select>

                <div className="checkbox-group">
                    <label>
                        <input type="checkbox" name="maneja" checked={formData.maneja} onChange={handleChange} /> ¿Maneja?
                    </label>
                    <label>
                        <input type="checkbox" name="usaLentes" checked={formData.usaLentes} onChange={handleChange} /> ¿Usa lentes?
                    </label>
                    <label>
                        <input type="checkbox" name="diabetico" checked={formData.diabetico} onChange={handleChange} /> ¿Diabético?
                    </label>
                </div>

                <input
                    type="text"
                    name="otraEnfermedad"
                    placeholder="Otra enfermedad"
                    value={formData.otraEnfermedad}
                    onChange={handleChange}
                />

                <button type="submit">{hasData ? "Modificar datos" : "Enviar"}</button>

                {hasData && (
                    <button type="button" className="delete-button" onClick={handleDelete}>
                        Dar de baja usuario
                    </button>
                )}
            </form>
        </div>
    );
}
