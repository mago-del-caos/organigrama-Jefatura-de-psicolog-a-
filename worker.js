export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Configurar cabeceras CORS para permitir peticiones desde tu web
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Endpoint para OBTENER el organigrama actual
      if (url.pathname === "/api/org" && request.method === "GET") {
        let data = await env.ORG_KV.get("current_org");
        if (!data) {
          return new Response(JSON.stringify({ error: "No data found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        return new Response(data, {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Endpoint para GUARDAR/ACTUALIZAR el organigrama
      if (url.pathname === "/api/org" && request.method === "POST") {
        const body = await request.text();
        // Validar que sea un JSON válido
        JSON.parse(body);
        
        await env.ORG_KV.put("current_org", body);
        
        return new Response(JSON.stringify({ success: true, message: "Organigrama actualizado en la nube" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response("Endpoint no encontrado", { status: 404, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
