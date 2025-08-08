import { generateFlightsClient } from './src/lib/flightGenerator.ts';

async function testFlights() {
  console.log('🧪 Testing flight generation...');

  try {
    const flights = await generateFlightsClient('USA', 'LHR', 'Business class', 'Round Trip', '2025-08-07', '2025-08-09');
    
    console.log('✅ Generated flights count:', flights.length);
    
    flights.forEach((flight, index) => {
      console.log(`Flight ${index + 1}:`, {
        airline: flight.airline,
        price: flight.price,
        class: flight.class,
        hasReturnFlight: !!flight.returnFlight
      });
    });
    
    if (flights.length === 0) {
      console.log('❌ No flights generated!');
    } else if (flights.some(f => !f.price || f.price === 0)) {
      console.log('❌ Some flights have missing or zero prices!');
    } else {
      console.log('✅ All flights have valid prices');
    }
    
  } catch (error) {
    console.error('❌ Error generating flights:', error);
  }
}

testFlights();