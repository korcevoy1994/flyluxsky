import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, email, phone, from, to, tripType, departureDate, returnDate, passengers, adults, children, lapInfants, class: flightClass, airline, flightTime, hotel, cruise, pricePerPassenger, priceTotal, stops, multiSegments, airline2nd, airline3rd, flightTime2nd, flightTime3rd } = await req.json();
  
  // Validate required fields
  if (!name || !email || !phone) {
    return NextResponse.json({ 
      message: 'Missing required contact information.', 
      details: 'Name, email, and phone are required fields.',
      'validation-errors': [{ message: 'Missing required contact information (name, email, phone)' }]
    }, { status: 400 });
  }
  
  // Ensure numeric fields are properly typed
  const safePassengers = Number(passengers) || 1;
  const safeAdults = Number(adults) || 1;
  const safeChildren = Number(children) || 0;
  const safeLapInfants = Number(lapInfants) || 0;
  const safePricePerPassenger = Number(pricePerPassenger) || 0;
  const safePriceTotal = Number(priceTotal) || 0;

  const KOMMO_API_BASE_URL = process.env.KOMMO_API_BASE_URL;
  const KOMMO_API_TOKEN = process.env.KOMMO_API_TOKEN;

  // Log all received data for testing
  console.log('=== KOMMO API TEST - Received Data ===');
  console.log('Contact Info:', { name, phone, email });
  console.log('Flight Search Parameters:', {
    from, to, tripType, departureDate, returnDate,
    passengers, adults, children, lapInfants, 
    class: flightClass, airline, flightTime, 
    hotel, cruise, pricePerPassenger, priceTotal, stops,
    airline2nd, airline3rd, flightTime2nd, flightTime3rd
  });
  
  // Log multi-city segments if present
  if (multiSegments && Array.isArray(multiSegments)) {
    console.log('=== Multi-City Segments ===');
    multiSegments.forEach((segment, index) => {
      console.log(`Segment ${index + 1}:`, segment);
    });
  }

  if (!KOMMO_API_BASE_URL || !KOMMO_API_TOKEN) {
    // Kommo API credentials are not set - return test data instead
    console.log('=== KOMMO API TEST - No credentials, returning test response ===');
    return NextResponse.json({ 
      message: 'Test mode: Data logged to console. Kommo credentials not configured.',
      testData: {
        contact: { name, phone, email },
        searchParams: {
          from, to, tripType, departureDate, returnDate,
          passengers, adults, children, lapInfants,
          class: flightClass, airline, flightTime,
          hotel, cruise, pricePerPassenger, priceTotal, stops
        },
        multiSegments: multiSegments || []
      }
    }, { status: 200 });
  }

  const leadTitle = tripType === 'Multi-city' && multiSegments && multiSegments.length > 0
    ? `New Multi-City Flight Request: ${multiSegments.map((s: { from: string; to: string }) => `${s.from}-${s.to}`).join(' → ')}`
    : `New Flight Request: ${from} to ${to}`;

  // Real field IDs from Kommo CRM
  // Format dates for Kommo API (ISO 8601 with explicit timezone offset for account TZ)
  const ACCOUNT_TIME_ZONE = 'America/New_York'
  const formatDateForKommo = (dateString: string | undefined) => {
    if (!dateString) return undefined as unknown as string | undefined
    try {
      const m = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (!m) {
        console.warn(`Invalid date format: ${dateString}. Expected YYYY-MM-DD`)
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
  }

  // Map trip type to Kommo expected values
  const mapTripType = (type: string) => {
    const mapping: { [key: string]: string } = {
      'One-way': 'OneWay',
      'Round-trip': 'RoundTrip',
      'Round Trip': 'RoundTrip', 
      'Multi-city': 'MultiCity'
    };
    // Return mapped value or default to 'OneWay' for invalid types
    return mapping[type] || 'OneWay';
  };

  // Precompute formatted dates and log them for debugging
  const formattedDeparture = formatDateForKommo(departureDate)
  const formattedReturn = formatDateForKommo(returnDate)
  console.log('=== KOMMO DATE DEBUG ===')
  console.log('Raw departureDate:', departureDate)
  console.log('Formatted departure (RFC3339 with TZ):', formattedDeparture)
  console.log('Raw returnDate:', returnDate)
  console.log('Formatted return (RFC3339 with TZ):', formattedReturn)

  // Build multi-city segments summary for Kommo (one text field)
  const segments: { from: string; to: string; date?: string }[] = Array.isArray(multiSegments) ? multiSegments : []
  console.log('=== SEGMENTS DEBUG ===');
  console.log('Raw multiSegments:', multiSegments);
  console.log('Processed segments:', segments);
  segments.forEach((seg, idx) => {
    console.log(`Segment ${idx + 1}:`, seg);
    console.log(`  - from: ${seg.from}`);
    console.log(`  - to: ${seg.to}`);
    console.log(`  - date: ${seg.date}`);
    console.log(`  - formatted date: ${formatDateForKommo(seg.date)}`);
  });
  const multiSegmentsSummary = segments.length > 0
    ? segments.map((seg, idx) => `${idx + 1}) ${seg.from} → ${seg.to}${seg.date ? ` (${seg.date})` : ''}`).join('\n')
    : ''

  // Map cabin class to Kommo expected values
  const mapCabinClass = (cabinClass: string) => {
    const mapping: { [key: string]: string } = {
      'Economy': 'Economy',
      'Premium': 'Premium',
      'Business': 'Business',
      'First': 'First',
      'Business class': 'Business',
      'First class': 'First'
    };
    // Return mapped value or default to 'Economy' for invalid classes
    return mapping[cabinClass] || 'Economy';
  };

  let customFields = [
    { field_id: 1966554, values: [{ value: from }] },           // From
    { field_id: 1966558, values: [{ value: to }] },             // Going to
    { field_id: 1966578, values: [{ value: formattedDeparture }] },  // Departure date
    { field_id: 1966584, values: [{ value: formattedReturn }] },     // Return date
    { field_id: 1966588, values: [{ value: String(safeAdults) }] },         // Adults
    { field_id: 1966590, values: [{ value: String(safeChildren) }] },       // Children
    { field_id: 1966592, values: [{ value: String(safeLapInfants) }] },    // Lap Infants
    { field_id: 1974042, values: [{ value: String(safePassengers) }] },    // Number of travelers
    { field_id: 1973314, values: [{ value: mapCabinClass(flightClass) }] },   // Cabin type (First, Business, Premium, Economy)
    { field_id: 2003851, values: [{ value: airline }] },       // Airline
    { field_id: 2003853, values: [{ value: flightTime }] },    // Flight time
    { field_id: 1973312, values: [{ value: mapTripType(tripType) }] },      // Trip Type (OneWay, RoundTrip, MultiCity)
    { field_id: 2003855, values: [{ value: hotel }] },         // Hotel
    { field_id: 2003857, values: [{ value: cruise }] },        // Cruise
    { field_id: 2003859, values: [{ value: String(safePricePerPassenger) }] }, // Price on website - Per Passenger
    { field_id: 2003861, values: [{ value: String(safePriceTotal) }] },    // Price on website - Total
    { field_id: 2003863, values: [{ value: stops }] },         // Stops
    { field_id: 2003983, values: [{ value: airline2nd || '' }] },       // Airline 2nd
    { field_id: 2003985, values: [{ value: airline3rd || '' }] },       // Airline 3rd
    { field_id: 2003987, values: [{ value: flightTime2nd || '' }] },    // Flight time 2nd
    { field_id: 2003989, values: [{ value: flightTime3rd || '' }] },    // Flight time 3rd
    // Checkbox fields with YES/NO status
    ...(hotel === 'Yes' ? [{ field_id: 2004045, values: [{ value: 'YES' }] }] : [{ field_id: 2004045, values: [{ value: 'NO' }] }]), // Hotel checkbox
    ...(cruise === 'Yes' ? [{ field_id: 2004041, values: [{ value: 'YES' }] }] : [{ field_id: 2004041, values: [{ value: 'NO' }] }]), // Cruise checkbox
  ];

  // Add multi-city segments to specific Kommo fields
  if (segments.length > 1) {
    // Second segment (index 1)
    if (segments[1]) {
      customFields.push(
        { field_id: 1966566, values: [{ value: segments[1].from }] },  // Multi-city From 2
        { field_id: 1966562, values: [{ value: segments[1].to }] },    // Multi-city To 2
        { field_id: 1966584, values: [{ value: formatDateForKommo(segments[1].date) }] } // Multi-city Date 2 (using Return date field)
      )
    }
    
    // Third segment (index 2)
    if (segments[2]) {
      customFields.push(
        { field_id: 1966568, values: [{ value: segments[2].from }] },  // Multi-city From 3
        { field_id: 1966570, values: [{ value: segments[2].to }] },    // Multi-city To 3
        { field_id: 1966582, values: [{ value: formatDateForKommo(segments[2].date) }] } // Multi-city Date 3
      )
    }
  }

  // Log all fields before filtering
  console.log('=== All Custom Fields (before filtering) ===');
  customFields.forEach((field, index) => {
    const fieldNames = [
      'From', 'Going to', 'Departure date', 'Return date', 'Adults', 'Children', 
      'Lap Infants', 'Number of travelers', 'Cabin type', 'Airline', 'Flight time', 
      'Trip Type', 'Hotel', 'Cruise', 'Price Per Passenger', 'Price Total', 'Stops'
    ];
    // Add dynamic field names for multi-city segments
    if (field.field_id === 1966566) fieldNames.push('Multi-city From 2');
    if (field.field_id === 1966562) fieldNames.push('Multi-city To 2');
    if (field.field_id === 1966584) fieldNames.push(tripType === 'multi-city' ? 'Multi-city Date 2' : 'Return date');
    if (field.field_id === 1966568) fieldNames.push('Multi-city From 3');
    if (field.field_id === 1966570) fieldNames.push('Multi-city To 3');
    if (field.field_id === 1966582) fieldNames.push('Multi-city Date 3');
    
    const fieldName = fieldNames.find((_, i) => {
      const standardFields = 17; // Number of standard fields
      if (index < standardFields) return i === index;
      // For multi-city fields, match by field_id
      if (field.field_id === 1966566) return fieldNames[i] === 'Multi-city From 2';
      if (field.field_id === 1966562) return fieldNames[i] === 'Multi-city To 2';
      if (field.field_id === 1966580) return fieldNames[i] === 'Multi-city Date 2';
      if (field.field_id === 1966568) return fieldNames[i] === 'Multi-city From 3';
      if (field.field_id === 1966570) return fieldNames[i] === 'Multi-city To 3';
      if (field.field_id === 1966582) return fieldNames[i] === 'Multi-city Date 3';
      return false;
    }) || `Field ${field.field_id}`;
    
    console.log(`${fieldName} (${field.field_id}):`, field.values[0].value);
  });

  // Optionally include multi-city itinerary into a custom Text field if env is set
  const multiSegmentsFieldIdStr = process.env.KOMMO_FIELD_ID_MULTI_SEGMENTS
  const multiSegmentsFieldId = multiSegmentsFieldIdStr ? parseInt(multiSegmentsFieldIdStr, 10) : NaN
  if (multiSegmentsSummary && multiSegmentsFieldIdStr && !Number.isNaN(multiSegmentsFieldId)) {
    customFields.push({ field_id: multiSegmentsFieldId, values: [{ value: multiSegmentsSummary }] })
  } else if (multiSegmentsSummary) {
    console.log('Note: KOMMO_FIELD_ID_MULTI_SEGMENTS is not set or invalid. Multi-city itinerary will only appear in the lead title.')
  }

  // Log all fields before filtering
  // Filter out empty fields
  const filteredFields = customFields.filter(field => field.values[0].value);
  console.log('=== Fields that will be sent to Kommo (non-empty only) ===');
  filteredFields.forEach((field) => {
    const fieldNames = [
      'From', 'Going to', 'Departure date', 'Return date', 'Adults', 'Children', 
      'Lap Infants', 'Number of travelers', 'Cabin type', 'Airline', 'Flight time', 
      'Trip Type', 'Hotel', 'Cruise', 'Price Per Passenger', 'Price Total', 'Stops'
    ];
    
    // Find field name by field_id for multi-city fields
    let fieldName = 'Field';
    const originalIndex = customFields.findIndex(f => f.field_id === field.field_id);
    if (originalIndex < 17) {
      fieldName = fieldNames[originalIndex];
    } else {
      // Multi-city fields
      if (field.field_id === 1966566) fieldName = 'Multi-city From 2';
      else if (field.field_id === 1966562) fieldName = 'Multi-city To 2';
      else if (field.field_id === 1966580) fieldName = 'Multi-city Date 2';
      else if (field.field_id === 1966568) fieldName = 'Multi-city From 3';
      else if (field.field_id === 1966570) fieldName = 'Multi-city To 3';
      else if (field.field_id === 1966582) fieldName = 'Multi-city Date 3';
      else if (multiSegmentsSummary && field.field_id === multiSegmentsFieldId) fieldName = 'Multi-city segments';
    }
    
    console.log(`${fieldName} (${field.field_id}):`, field.values[0].value);
  });

  const complexLead = [
    {
      name: leadTitle,
      price: priceTotal || 0,
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
      custom_fields_values: filteredFields, // Send only filled fields
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
      const responseText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.log('=== KOMMO API ERROR - Failed to parse response ===');
        console.log('Status:', response.status);
        console.log('Response Text:', responseText);
        console.log('Parse Error:', parseError);
        return NextResponse.json({ 
          message: 'Failed to create lead in CRM.', 
          details: 'Invalid response format',
          'validation-errors': [{ message: 'Invalid response format from CRM API' }]
        }, { status: response.status });
      }
      console.log('=== KOMMO API ERROR ===');
      console.log('Status:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('Error Data:', JSON.stringify(errorData, null, 2));
      console.log('Request Body that was sent:', JSON.stringify(complexLead, null, 2));
      
      // Log validation errors specifically if they exist
      if (errorData?.['validation-errors']) {
        console.log('=== KOMMO VALIDATION ERRORS ===');
        errorData['validation-errors'].forEach((error: any, index: number) => {
          console.log(`Kommo Validation Error ${index + 1}:`, error);
        });
      }
      
      // Kommo API error - pass through validation errors
      return NextResponse.json({ 
        message: 'Failed to create lead in CRM.', 
        details: errorData,
        'validation-errors': errorData?.['validation-errors'] || [{ message: 'Unknown validation error' }],
        title: 'Bad Request',
        type: 'https://httpstatus.es/400',
        status: response.status,
        detail: 'Request validation failed'
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ message: 'Lead created successfully!', data }, { status: 200 });

  } catch (error) {
    // Error sending request to Kommo API
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}