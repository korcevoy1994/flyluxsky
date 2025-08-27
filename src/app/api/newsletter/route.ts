import { NextRequest, NextResponse } from 'next/server';

const KOMMO_API_BASE_URL = process.env.KOMMO_API_BASE_URL;
const KOMMO_API_TOKEN = process.env.KOMMO_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    if (!KOMMO_API_BASE_URL || !KOMMO_API_TOKEN) {
      console.error('Missing Kommo API configuration');
      return NextResponse.json({ message: 'CRM configuration error.' }, { status: 500 });
    }

    const leadTitle = `Newsletter Subscription - ${email}`;

    const complexLead = [
      {
        name: leadTitle,
        price: 0,
        _embedded: {
          contacts: [
            {
              first_name: 'Newsletter Subscriber',
              custom_fields_values: [
                {
                  field_code: 'EMAIL',
                  values: [{ value: email }],
                },
              ],
            },
          ],
        },
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
        return NextResponse.json({ message: 'Failed to create newsletter subscription in CRM.', details: errorData }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ message: 'Newsletter subscription created successfully!', data }, { status: 200 });

    } catch (error) {
      console.error('Error sending request to Kommo API:', error);
      return NextResponse.json({ message: 'Failed to create newsletter subscription in CRM.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing newsletter subscription request:', error);
    return NextResponse.json({ message: 'Invalid request data.' }, { status: 400 });
  }
}