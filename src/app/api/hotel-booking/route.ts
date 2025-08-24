import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, destination, checkIn, checkOut, guests, rooms, adults, children, needsFlight, needsCruise } = await req.json();
    
    console.log('Hotel booking request received:', { name, phone, email, destination, checkIn, checkOut, guests, rooms, adults, children, needsFlight, needsCruise });

    const KOMMO_API_BASE_URL = process.env.KOMMO_API_BASE_URL;
    const KOMMO_API_TOKEN = process.env.KOMMO_API_TOKEN;

    if (!KOMMO_API_BASE_URL || !KOMMO_API_TOKEN) {
      console.error('Kommo API credentials missing');
      return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

  const leadTitle = `New Hotel Booking: ${destination}`;

  // Format dates for Kommo API (ISO 8601 with explicit timezone offset for account TZ)
  const ACCOUNT_TIME_ZONE = 'America/New_York'
  const formatDateForKommo = (dateString: string | undefined) => {
    if (!dateString) return undefined as unknown as string | undefined
    try {
      const m = dateString.match(/^(\d{4})-(\d{2})-(\d{2})T/)
      if (!m) {
        console.warn(`Invalid date format: ${dateString}. Expected ISO string`)
        return undefined as unknown as string | undefined
      }
      const [, ys, ms, ds] = m
      const year = parseInt(ys, 10)
      const month = parseInt(ms, 10)
      const day = parseInt(ds, 10)

      // Find timezone offset for the account timezone at this date
      const referenceUTC = Date.UTC(year, month - 1, day, 12, 0, 0) // use noon to avoid DST boundaries
      const refDate = new Date(referenceUTC)
      const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone: ACCOUNT_TIME_ZONE,
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      const parts = dtf.formatToParts(refDate)
      const get = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value || '00'
      const tzY = parseInt(get('year'), 10)
      const tzM = parseInt(get('month'), 10)
      const tzD = parseInt(get('day'), 10)
      const tzH = parseInt(get('hour'), 10)
      const tzMin = parseInt(get('minute'), 10)
      const tzS = parseInt(get('second'), 10)

      const tzUtcTimestamp = Date.UTC(tzY, tzM - 1, tzD, tzH, tzMin, tzS)
      const offsetMs = tzUtcTimestamp - referenceUTC // positive means tz ahead of UTC
      const offsetTotalMinutes = Math.round(offsetMs / 60000)
      const sign = offsetTotalMinutes >= 0 ? '+' : '-'
      const absMinutes = Math.abs(offsetTotalMinutes)
      const oh = String(Math.floor(absMinutes / 60)).padStart(2, '0')
      const om = String(absMinutes % 60).padStart(2, '0')
      const offsetStr = `${sign}${oh}:${om}`

      // Construct RFC3339 string for 12:00:00 at account timezone
      return `${ys}-${ms}-${ds}T12:00:00${offsetStr}`
    } catch (error) {
      console.warn(`Error formatting date: ${dateString}`, error)
      return undefined as unknown as string | undefined
    }
  };

  // Precompute formatted dates and log them for debugging
  const formattedCheckIn = formatDateForKommo(checkIn)
  const formattedCheckOut = formatDateForKommo(checkOut)
  console.log('=== HOTEL BOOKING DATE DEBUG ===')
  console.log('Raw checkIn:', checkIn)
  console.log('Formatted check-in (RFC3339 with TZ):', formattedCheckIn)
  console.log('Raw checkOut:', checkOut)
  console.log('Formatted check-out (RFC3339 with TZ):', formattedCheckOut)

  // Real field IDs from Kommo CRM
  const totalGuests = adults + children;
  const customFields = [
    { field_id: 2003871, values: [{ value: destination }] },    // Destination
    { field_id: 2003865, values: [{ value: formattedCheckIn }] },        // Check-in date
    { field_id: 2003867, values: [{ value: formattedCheckOut }] },       // Check-out date
    { field_id: 2004025, values: [{ value: String(totalGuests) }] },     // Общее кол-во гостей (Guests)
    { field_id: 2004027, values: [{ value: String(adults) }] },          // Adults
    { field_id: 2004029, values: [{ value: String(children) }] },        // Children
    { field_id: 2004023, values: [{ value: adults > 0 ? 'Adults' : children > 0 ? 'Children' : 'Adults' }] }, // Guests type (Adults/Children)
    // Checkbox fields with YES/NO status
    ...(needsFlight ? [{ field_id: 2004039, values: [{ value: 'YES' }] }] : [{ field_id: 2004039, values: [{ value: 'NO' }] }]), // Needs Flight
    ...(needsCruise ? [{ field_id: 2004041, values: [{ value: 'YES' }] }] : [{ field_id: 2004041, values: [{ value: 'NO' }] }]), // Needs Cruise
  ];

  const complexLead = [
    {
      name: leadTitle,
      price: 0, // Hotel price can be added later
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
      return NextResponse.json({ message: 'Failed to create hotel booking lead in CRM.', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ message: 'Hotel booking lead created successfully!', data }, { status: 200 });

  } catch (error) {
    console.error('Error sending request to Kommo API:', error);
    return NextResponse.json({ message: 'Failed to create hotel booking lead in CRM.' }, { status: 500 });
  }
  } catch (error) {
    console.error('Error processing hotel booking request:', error);
    return NextResponse.json({ message: 'Invalid request data.' }, { status: 400 });
  }
}