import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = join(__dirname, '..', 'src', 'lib', 'airports.json');

try {
  const data = fs.readFileSync(outputPath, 'utf8');
  const airports = JSON.parse(data);
  
  console.log(`✅ Загружено ${airports.length} аэропортов`);
  
  // Покажем некоторые популярные аэропорты
  const popularCodes = ['JFK', 'LAX', 'LHR', 'CDG', 'DXB', 'NRT', 'SIN', 'FRA', 'AMS', 'ICN'];
  const popularAirports = airports.filter(airport => popularCodes.includes(airport.code));
  
  console.log('\n🌟 Популярные аэропорты найдены:');
  popularAirports.forEach(airport => {
    console.log(`   • ${airport.name} (${airport.code}) - ${airport.city}, ${airport.country}`);
  });
  
  // Покажем аэропорты по странам
  const countries = {};
  airports.forEach(airport => {
    if (!countries[airport.country]) {
      countries[airport.country] = 0;
    }
    countries[airport.country]++;
  });
  
  const sortedCountries = Object.entries(countries)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  console.log('\n📊 Топ-10 стран по количеству аэропортов:');
  sortedCountries.forEach(([country, count]) => {
    console.log(`   • ${country}: ${count} аэропортов`);
  });
  
} catch (error) {
  console.error('❌ Ошибка при загрузке аэропортов:', error.message);
} 