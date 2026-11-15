
"use client";

import { useState } from "react";

export default function Formulario() {
    const [datos, setDatos] = useState({
        nombre: "",
        matricula: "",
        materia: "",
        nota: ""
    });

    const [mensaje, setMensaje] = useState("");
    const [exito, setExito] = useState(false);
    const [cargando, setCargando] = useState(false);

    const indice = datos.nota !== "" && /^\d+$/.test(datos.nota)
        && Number(datos.nota) <= 100
        ? Number(datos.nota) >= 90 ? 4
        : Number(datos.nota) >= 80 ? 3
        : Number(datos.nota) >= 70 ? 2
        : Number(datos.nota) >= 60 ? 1 : 0
        : null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    };

    const enviar = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje("");

        if (!/^[\p{L}\s]+$/u.test(datos.nombre.trim())) {
            setMensaje("El nombre solo debe contener letras.");
            setExito(false);
            return;
        }

        if (!/^[0-9-]+$/.test(datos.matricula)) {
            setMensaje("La matrícula solo admite números y guiones.");
            setExito(false);
            return;
        }

        if (!datos.materia.trim() || datos.materia.trim().length > 60) {
            setMensaje("La materia debe tener entre 1 y 60 caracteres.");
            setExito(false);
            return;
        }

        if (!/^\d+$/.test(datos.nota) || Number(datos.nota) > 100) {
            setMensaje("La nota debe ser un entero entre 0 y 100.");
            setExito(false);
            return;
        }

        setCargando(true);

        try {
            const respuesta = await fetch("/api/estudiante", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...datos,
                    nombre: datos.nombre.trim(),
                    materia: datos.materia.trim(),
                    nota: Number(datos.nota)
                })
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                setMensaje("¡Datos enviados correctamente! Índice: " + resultado.indice);
                setExito(true);

                setDatos({
                    nombre: "",
                    matricula: "",
                    materia: "",
                    nota: ""
                });
            } else {
                setMensaje(resultado.mensaje);
                setExito(false);
            }

        } catch {
            setMensaje("No se pudieron enviar los datos.");
            setExito(false);
        } finally {
            setCargando(false);
        }
    };

    const estiloInput = "w-full border border-[#E8C3CA] bg-[#FFF9FA] rounded-lg px-4 py-3 text-[#4D1721] outline-none transition focus:border-[#A51F37] focus:ring-2 focus:ring-[#A51F37]/15 placeholder:text-[#B99A9F]";

    return (
        <main className="min-h-screen bg-[#F9F2F3] flex items-center justify-center p-5">

            <form
                onSubmit={enviar}
                className="bg-white w-full max-w-md p-7 sm:p-9 rounded-2xl shadow-lg shadow-[#80172B]/10 border border-[#F1DDE0]"
            >

                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-[#F8E6E9] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        📋
                    </div>

                    <h1 className="text-2xl font-bold text-[#80172B]">
                        Registro de Estudiantes
                    </h1>

                    <p className="text-sm text-[#98777D] mt-2">
                        Introduce los datos académicos del estudiante.
                    </p>
                </div>

                <div className="space-y-5">

                    <div>
                        <label className="block text-sm font-semibold text-[#651A2A] mb-2">
                            Nombre completo
                        </label>

                        <input
                            name="nombre"
                            value={datos.nombre}
                            onChange={handleChange}
                            className={estiloInput}
                            placeholder="Ej. Carlos Pérez"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#651A2A] mb-2">
                            Matrícula
                        </label>

                        <input
                            name="matricula"
                            value={datos.matricula}
                            onChange={handleChange}
                            className={estiloInput}
                            placeholder="Ej. 2026-001"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-semibold text-[#651A2A]">
                                Materia
                            </label>

                            <span className="text-xs text-[#A77D85]">
                                {datos.materia.length}/60
                            </span>
                        </div>

                        <input
                            name="materia"
                            value={datos.materia}
                            onChange={handleChange}
                            maxLength={60}
                            className={estiloInput}
                            placeholder="Nombre de la materia"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#651A2A] mb-2">
                            Nota
                        </label>

                        <input
                            name="nota"
                            type="text"
                            inputMode="numeric"
                            value={datos.nota}
                            onChange={handleChange}
                            className={estiloInput}
                            placeholder="Nota de 0 a 100"
                            required
                        />

                        {indice !== null && (
                            <p className="text-sm text-[#A51F37] mt-2 font-semibold">
                                Índice calculado: {indice}
                            </p>
                        )}
                    </div>

                </div>

                {mensaje && (
                    <div className={`mt-5 p-3 rounded-lg text-sm text-center font-medium ${
                        exito
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-[#A51F37] border border-red-200"
                    }`}>
                        {mensaje}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={cargando}
                    className="w-full mt-7 bg-[#A51F37] hover:bg-[#80172B] text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-60"
                >
                    {cargando ? "Enviando..." : "Enviar datos"}
                </button>

                <p className="text-center text-xs text-[#B69A9F] mt-5">
                    Registro académico de estudiantes
                </p>

            </form>
        </main>
    );
}
