// Test script to reproduce the 400 error from the form
const testFormData = {
  name: 'Alex',
  email: 'korcevoy.ui@gmail.com',
  phone: '+1 (610) 111-8722',
  from: 'JFK', // Default values since they're not visible in the form
  to: 'LAX',
  tripType: 'One-way',
  departureDate: '2025-01-22',
  returnDate: undefined,
  passengers: 1,
  adults: 1,
  children: 0,
  lapInfants: 0,
  class: 'Economy',
  airline: '',
  flightTime: '',
  hotel: 'Yes', // From the checkbox
  cruise: 'Yes', // From the checkbox
  pricePerPassenger: 0,
  priceTotal: 0,
  stops: ''
};

fetch('http://localhost:3001/api/kommo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testFormData),
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.error('Error:', error);
});