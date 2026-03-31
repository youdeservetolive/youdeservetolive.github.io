const COUNTRY_MAP = {
  US: "United States",
  DZ: "Algeria",
  AO: "Angola",
  AR: "Argentina",
  AM: "Armenia",
  AU: "Australia",
  AT: "Austria",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BE: "Belgium",
  BO: "Bolivia",
  BA: "Bosnia & Herzegovina",
  BW: "Botswana",
  BR: "Brazil",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  CA: "Canada",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  HR: "Croatia",
  CZ: "Czech Republic",
  DK: "Denmark",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  EE: "Estonia",
  ET: "Ethiopia",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  GH: "Ghana",
  GR: "Greece",
  IN: "India",
  IT: "Italy",
  JP: "Japan",
  KE: "Kenya",
  MY: "Malaysia",
  MX: "Mexico",
  NZ: "New Zealand",
  KR: "Republic of Korea",
  RU: "Russia",
  SG: "Singapore",
  ZA: "South Africa",
  ES: "Spain",
  GB: "United Kingdom",
  ZW: "Zimbabwe"
};

const CONTINENT_MAP = {
  AF: "Africa",
  AN: "Antarctica",
  AS: "Asia",
  EU: "Europe",
  NA: "North America",
  OC: "Oceania",
  SA: "South America"
};

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
    const countryCode = cf.country || "";
    const continentCode = cf.continent || "";

    const countryName = COUNTRY_MAP[countryCode] || countryCode || "";
    const continentName = CONTINENT_MAP[continentCode] || continentCode || "";

    return new Response(
      JSON.stringify({
        ip: request.headers.get("CF-Connecting-IP") || "",
        success: true,
        type: "",
        continent: continentName,
        continent_code: continentCode,
        country: countryName,
        country_code: countryCode,
        country_flag: countryCode
          ? `https://cdn.ipwhois.io/flags/${countryCode.toLowerCase()}.svg`
          : "",
        country_capital: "",
        country_phone: "",
        country_neighbours: "",
        region: cf.region || "",
        city: cf.city || "",
        latitude: cf.latitude ? Number(cf.latitude) : null,
        longitude: cf.longitude ? Number(cf.longitude) : null,
        asn: "",
        org: "",
        isp: "",
        timezone: cf.timezone || "",
        timezone_name: "",
        timezone_dstOffset: null,
        timezone_gmtOffset: null,
        timezone_gmt: "",
        currency: "",
        currency_code: "",
        currency_symbol: "",
        currency_rates: null,
        currency_plural: ""
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
