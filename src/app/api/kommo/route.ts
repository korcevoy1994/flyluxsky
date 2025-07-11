import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, phone, email, from, to, tripType, departureDate, returnDate, passengers, class: flightClass, price } = await req.json();

  const KOMMO_API_BASE_URL = process.env.KOMMO_API_BASE_URL;
  const KOMMO_API_TOKEN = process.env.KOMMO_API_TOKEN;

  if (!KOMMO_API_BASE_URL || !KOMMO_API_TOKEN) {
    console.error('Kommo API credentials are not set in .env.local');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  const leadTitle = `New Flight Request: ${from} to ${to}`;

  // =================================================================
  // ВАЖНО: Замени 12345 на реальные ID полей из твоего Kommo
  // =================================================================
  const customFields = [
    { field_id: 5616, values: [{ value: from }] },         // <-- ID для поля "From"
    { field_id: 5618, values: [{ value: to }] },           // <-- ID для поля "To"
    { field_id: 5620, values: [{ value: tripType }] },      // <-- ID для поля "Trip-Type"
    { field_id: 5622, values: [{ value: departureDate }] }, // <-- ID для поля "Departure-Date"
    { field_id: 5624, values: [{ value: returnDate }] },    // <-- ID для поля "Return-Date"
    { field_id: 5626, values: [{ value: passengers }] },    // <-- ID для поля "Passengers"
    { field_id: 5678, values: [{ value: flightClass }] },   // <-- ID для поля "Class"
  ];

  const complexLead = [
    {
      name: leadTitle,
      price: price || 0,
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
      custom_fields_values: customFields.filter(field => field.values[0].value), // Отправляем только заполненные поля
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
      console.error('Kommo API error:', errorData);
      return NextResponse.json({ message: 'Failed to create lead in CRM.', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ message: 'Lead created successfully!', data }, { status: 200 });

  } catch (error) {
    console.error('Error sending request to Kommo API:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
} 