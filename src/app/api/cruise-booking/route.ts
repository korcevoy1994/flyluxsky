import { NextRequest, NextResponse } from 'next/server';

// Function to format date for KOMMO (RFC3339 format with timezone)
function formatDateForKommo(date: Date): string {
  // Get timezone offset in minutes and convert to hours and minutes
  const timezoneOffset = date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
  const offsetMinutes = Math.abs(timezoneOffset) % 60;
  const offsetSign = timezoneOffset <= 0 ? '+' : '-';
  const timezoneString = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
  
  // Format date as YYYY-MM-DDTHH:mm:ss±HH:mm
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneString}`;
}

export async function POST(req: NextRequest) {
  const { name, phone, email, cruiseLine, region, departureDate, nights, adults, children, needsFlight, needsHotel } = await req.json();

  const KOMMO_API_BASE_URL = process.env.KOMMO_API_BASE_URL;
  const KOMMO_API_TOKEN = process.env.KOMMO_API_TOKEN;

  if (!KOMMO_API_BASE_URL || !KOMMO_API_TOKEN) {
    // Kommo API credentials are not set in .env.local
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  const leadTitle = `New Cruise Booking: ${cruiseLine} - ${region}`;

  // Format dates for KOMMO
  const formattedDepartureDate = departureDate ? formatDateForKommo(new Date(departureDate)) : null;
  
  // Log the dates for debugging
  console.log('Raw departure date:', departureDate);
  console.log('Formatted departure date:', formattedDepartureDate);

  // Calculate total guests
  const totalGuests = adults + children;

  // Real field IDs from Kommo CRM
  const customFields = [
    { field_id: 2003875, values: [{ value: cruiseLine }] },     // Cruise Line
    { field_id: 2003873, values: [{ value: region }] },         // Region
    { field_id: 2003877, values: [{ value: formattedDepartureDate }] },  // Departure Date
    { field_id: 2003879, values: [{ value: nights.toString() }] },         // Number of Nights
    { field_id: 2004031, values: [{ value: totalGuests.toString() }] },    // Total passengers
    { field_id: 2004037, values: [{ value: adults.toString() }] },         // Adults
    { field_id: 2004035, values: [{ value: children.toString() }] },       // Children
    { field_id: 2004023, values: [{ value: adults > 0 ? 'Adults' : children > 0 ? 'Children' : 'Adults' }] }, // Guests type (Adults/Children)
    // Checkbox fields with YES/NO status
    ...(needsFlight ? [{ field_id: 2004043, values: [{ value: 'YES' }] }] : [{ field_id: 2004043, values: [{ value: 'NO' }] }]), // Needs Flight
    ...(needsHotel ? [{ field_id: 2004045, values: [{ value: 'YES' }] }] : [{ field_id: 2004045, values: [{ value: 'NO' }] }]), // Needs Hotel
  ];

  const complexLead = [
    {
      name: leadTitle,
      price: 0, // Cruise price can be added later
      _embedded: {
        contacts: [
          {
            first_name: name,
            custom_fields_values: [
              {
                field_code: 'EMAIL',
                values: [{ value: email }],
              },
              {
                field_code: 'PHONE',
                values: [{ value: phone }],
              },
            ],
          },
        ],
      },
      custom_fields_values: customFields.filter(field => field.values[0].value), // Send only filled fields
    },
  ];

  try {
    const response = await fetch(`${KOMMO_API_BASE_URL}/api/v4/leads/complex`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KOMMO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complexLead),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Kommo API error
      return NextResponse.json({ message: 'Failed to create cruise booking lead in CRM.', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ message: 'Cruise booking lead created successfully!', data }, { status: 200 });

  } catch (error) {
    // Error sending request to Kommo API
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}