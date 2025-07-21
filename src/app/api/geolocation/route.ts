import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      headers: {
        'User-Agent': 'FlyLuxSky/1.0'
      }
    });
    
    if (!response.ok) {
      // Fallback to ip-api.com if ipapi.co fails
      const fallbackResponse = await fetch('http://ip-api.com/json/', {
        headers: {
          'User-Agent': 'FlyLuxSky/1.0'
        }
      });
      
      if (!fallbackResponse.ok) {
        throw new Error(`Both geolocation services failed: ${response.status} and ${fallbackResponse.status}`);
      }
      
      const fallbackData = await fallbackResponse.json();
      return NextResponse.json({
        ip: fallbackData.query,
        city: fallbackData.city,
        region: fallbackData.regionName,
        country: fallbackData.country,
        country_code: fallbackData.countryCode,
        latitude: fallbackData.lat,
        longitude: fallbackData.lon,
        timezone: fallbackData.timezone,
        org: fallbackData.org
      });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching IP geolocation in API route:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: "Failed to fetch geolocation data", 
      details: errorMessage,
      suggestion: "Try again later or check your network connection"
    }, { status: 500 });
  }
}