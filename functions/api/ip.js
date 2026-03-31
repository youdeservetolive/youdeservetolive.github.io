export async function onRequest(context) {
  const { request } = context;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers
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
        headers
      }
    );
  }

  try {
    const cf = request.cf || {};

    return new Response(
      JSON.stringify({
        success: true,
        ip: request.headers.get("CF-Connecting-IP") || "",
        country: cf.country || "",
        region: cf.region || "",
        regionCode: cf.regionCode || "",
        city: cf.city || "",
        continent: cf.continent || "",
        postalCode: cf.postalCode || "",
        latitude: cf.latitude || "",
        longitude: cf.longitude || "",
        timezone: cf.timezone || ""
      }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to read Cloudflare geolocation"
      }),
      {
        status: 500,
        headers
      }
    );
  }
}
