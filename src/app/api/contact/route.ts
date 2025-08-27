import { NextRequest, NextResponse } from 'next/server';

const KOMMO_API_BASE_URL = process.env.KOMMO_API_BASE_URL;
const KOMMO_API_TOKEN = process.env.KOMMO_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, destination, message } = await request.json();

    if (!fullName || !email || !message) {
      return NextResponse.json({ message: 'Full name, email and message are required.' }, { status: 400 });
    }

    if (!KOMMO_API_BASE_URL || !KOMMO_API_TOKEN) {
      console.error('Missing Kommo API configuration');
      return NextResponse.json({ message: 'CRM configuration error.' }, { status: 500 });
    }

    const leadTitle = `Contact Form - ${fullName}`;

    // Prepare custom fields
    const customFields = [];
    
    if (destination) {
      customFields.push({
        field_id: 2004091, // Preferred destination
        values: [{ value: destination }],
      });
    }
    
    if (message) {
      customFields.push({
        field_id: 2004093, // Message
        values: [{ value: message }],
      });
    }

    const complexLead = [
      {
        name: leadTitle,
        price: 0,
        _embedded: {
          contacts: [
            {
              first_name: fullName,
              custom_fields_values: [
                {
                  field_code: 'EMAIL',
                  values: [{ value: email }],
                },
                ...(phone ? [{
                  field_code: 'PHONE',
                  values: [{ value: phone }],
                }] : []),
              ],
            },
          ],
        },
        custom_fields_values: customFields,
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
        return NextResponse.json({ message: 'Failed to create contact lead in CRM.', details: errorData }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ message: 'Contact form submitted successfully!', data }, { status: 200 });

    } catch (error) {
      console.error('Error sending request to Kommo API:', error);
      return NextResponse.json({ message: 'Failed to create contact lead in CRM.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing contact form request:', error);
    return NextResponse.json({ message: 'Invalid request data.' }, { status: 400 });
  }
}