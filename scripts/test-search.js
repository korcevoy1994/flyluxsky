const fs = require('fs');
const path = require('path');

// Загружаем данные аэропортов
const airportsPath = path.join(__dirname, '..', 'src', 'lib', 'airports.json');
const airportsData = JSON.parse(fs.readFileSync(airportsPath, 'utf8'));

// Функция поиска (копируем из utils.ts)
function searchAirports(query, limit = 10) {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase().trim();
  const results = [];
  
  for (const airport of airportsData) {
    if (results.length >= limit) break;
    
    const nameMatch = airport.name.toLowerCase().includes(searchTerm);
    const codeMatch = airport.code.toLowerCase().includes(searchTerm);
    const cityMatch = airport.city.toLowerCase().includes(searchTerm);
    const countryMatch = airport.country.toLowerCase().includes(searchTerm);
    
    if (nameMatch || codeMatch || cityMatch || countryMatch) {
      results.push(airport);
    }
  }
  
  // Сортируем результаты по релевантности
  return results.sort((a, b) => {
    // Приоритет: точное совпадение кода, затем начало кода, затем остальное
    if (a.code.toLowerCase() === searchTerm) return -1;
    if (b.code.toLowerCase() === searchTerm) return 1;
    
    if (a.code.toLowerCase().startsWith(searchTerm)) return -1;
    if (b.code.toLowerCase().startsWith(searchTerm)) return 1;
    
    if (a.city.toLowerCase().startsWith(searchTerm)) return -1;
    if (b.city.toLowerCase().startsWith(searchTerm)) return 1;
    
    return a.name.localeCompare(b.name);
  });
}

console.log('🧪 Тестирование поиска аэропортов...\n');

// Тест 1: Поиск по коду
console.log('1. Поиск по коду "JFK":');
const jfkResults = searchAirports('JFK', 5);
jfkResults.forEach(airport => {
  console.log(`   • ${airport.name} (${airport.code}) - ${airport.city}, ${airport.country}`);
});

console.log('\n2. Поиск по коду "LAX":');
const laxResults = searchAirports('LAX', 5);
laxResults.forEach(airport => {
  console.log(`   • ${airport.name} (${airport.code}) - ${airport.city}, ${airport.country}`);
});

console.log('\n3. Поиск по названию города "London":');
const londonResults = searchAirports('London', 5);
londonResults.forEach(airport => {
  console.log(`   • ${airport.name} (${airport.code}) - ${airport.city}, ${airport.country}`);
});

console.log('\n4. Поиск по названию "Amsterdam":');
const amsterdamResults = searchAirports('Amsterdam', 5);
amsterdamResults.forEach(airport => {
  console.log(`   • ${airport.name} (${airport.code}) - ${airport.city}, ${airport.country}`);
});

console.log('\n5. Поиск по стране "Germany":');
const germanyResults = searchAirports('Germany', 5);
germanyResults.forEach(airport => {
  console.log(`   • ${airport.name} (${airport.code}) - ${airport.city}, ${airport.country}`);
});

console.log('\n6. Поиск по частичному коду "LA":');
const laResults = searchAirports('LA', 5);
laResults.forEach(airport => {
  console.log(`   • ${airport.name} (${airport.code}) - ${airport.city}, ${airport.country}`);
});

console.log('\n✅ Тестирование завершено!');
console.log(`📊 Общее количество аэропортов в базе: ${airportsData.length}`); 