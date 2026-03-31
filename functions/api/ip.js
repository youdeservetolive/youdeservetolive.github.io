export async function onRequest(context) {
  const { request } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  if (request.method !== "GET") {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Method not allowed"
      }),
      {
        status: 405,
        headers: corsHeaders
      }
    );
  }

  try {
    const clientIP =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "";

    if (!clientIP) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Could not determine client IP"
        }),
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const upstream = await fetch(`https://ipwho.is/${encodeURIComponent(clientIP)}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    const data = await upstream.json();

    if (!upstream.ok || data.success === false) {
      return new Response(
        JSON.stringify({
          success: false,
          message: data.message || "ipwho.is lookup failed",
          upstream_status: upstream.status
        }),
        {
          status: 502,
          headers: corsHeaders
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        ip: data.ip || clientIP,
        country: data.country || "",
        country_code: data.country_code || "",
        region: data.region || "",
        city: data.city || "",
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch IP location"
      }),
      {
        status: 502,
        headers: corsHeaders
      }
    );
  }
}
