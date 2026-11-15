import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { nombre, matricula, materia, nota } = await req.json();

        let indice = 0;

        if (nota >= 90) indice = 4;
        else if (nota >= 80) indice = 3;
        else if (nota >= 70) indice = 2;
        else if (nota >= 60) indice = 1;

        console.log("Datos del estudiante:");
        console.log("Nombre:", nombre);
        console.log("Matrícula:", matricula);
        console.log("Materia:", materia);
        console.log("Nota:", nota);
        console.log("Índice:", indice);

        return NextResponse.json({
            mensaje: "Datos recibidos correctamente",
            indice: indice
        });

    } catch (error) {
        return NextResponse.json(
            { mensaje: "Error al recibir los datos" },
            { status: 500 }
        );
    }
}