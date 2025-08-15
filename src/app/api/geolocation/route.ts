import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      headers: {
        'User-Agent': 'FlyLuxSky/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch geolocation data from ipapi.co: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Error fetching IP geolocation in API route
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: "Failed to fetch geolocation data", 
      details: errorMessage,
      suggestion: "Try again later or check your network connection"
    }, { status: 500 });
  }
}