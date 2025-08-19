// Простой тест для проверки логотипа Etihad Airways
const { generateFlightsClient } = require('./src/lib/flightGenerator.ts');

async function testEtihadLogo() {
  try {
    console.log('Тестируем генерацию рейсов Etihad Airways...');
    const flights = await generateFlightsClient('JFK', 'AUH', 'Business class', 'One-way');
    
    if (flights && flights.length > 0) {
      const etihadFlights = flights.filter(f => f.airline === 'Etihad Airways');
      console.log('Найдено рейсов Etihad Airways:', etihadFlights.length);
      
      if (etihadFlights.length > 0) {
        console.log('Первый рейс Etihad Airways:');
        console.log('Авиакомпания:', etihadFlights[0].airline);
        console.log('Логотип:', etihadFlights[0].logo);
      } else {
        console.log('Рейсы Etihad Airways не найдены');
        console.log('Доступные авиакомпании:', flights.map(f => f.airline));
      }
    } else {
      console.log('Рейсы не найдены');
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

testEtihadLogo();