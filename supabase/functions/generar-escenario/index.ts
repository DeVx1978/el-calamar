// 1. Importamos las herramientas de servidor (Deno)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log("Cerebro del Calamar Iniciado: Motor de Probabilidades en línea.");

// 2. Creamos la función principal que atenderá las peticiones del juego
serve(async (req) => {
  try {
    // Extraemos los datos que el jugador nos envía desde el frontend (Campo de Batalla)
    const { user_id, match_id } = await req.json()

    // --- MOTOR DE DIFICULTAD (El 1%) ---
    // Aquí el servidor decide el escenario. Por ahora, creamos un escenario base seguro.
    const escenario = {
      mensaje: "Escenario táctico generado con éxito",
      nivel_seguridad: "Máximo",
      jugador_recibido: user_id,
      partido_asignado: match_id,
      opciones: [
        { id: 'Opcion_A', texto: 'Victoria Local', odds: '2.10' },
        { id: 'Opcion_B', texto: 'Empate Táctico', odds: '3.40' }
      ]
    };

    // 3. Devolvemos la información al jugador de forma estructurada (JSON)
    return new Response(
      JSON.stringify(escenario),
      { headers: { "Content-Type": "application/json" } },
    )

  } catch (error) {
    // Si alguien intenta enviar datos corruptos, el sistema se defiende y lanza un error
    return new Response(JSON.stringify({ error: "Datos de solicitud inválidos" }), { status: 400 })
  }
})