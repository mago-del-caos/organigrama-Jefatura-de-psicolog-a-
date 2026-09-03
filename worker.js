export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    try {
      if (url.pathname === "/api/org" && request.method === "GET") {
        let data = await env.ORG_KV.get("current_org");
        if (!data) return new Response(JSON.stringify({ error: "No data" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        return new Response(data, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (url.pathname === "/api/org" && request.method === "POST") {
        const body = await request.text();
        JSON.parse(body);
        await env.ORG_KV.put("current_org", body);
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response("Not found", { status: 404, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }
};
