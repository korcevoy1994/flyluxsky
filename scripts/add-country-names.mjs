import fs from 'fs';
import path from 'path';
import iso31661 from 'iso-3166-1';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const projectRoot = path.resolve(__dirname, '..');
const jsonFilePath = path.join(projectRoot, 'src', 'lib', 'airports.json');

try {
  console.log(`Reading airports.json from: ${jsonFilePath}`);
  const airportsData = fs.readFileSync(jsonFilePath, 'utf8');
  const airports = JSON.parse(airportsData);

  console.log(`Found ${airports.length} airports. Converting country codes to full names...`);

  const updatedAirports = airports.map(airport => {
    const countryInfo = iso31661.whereAlpha2(airport.country);
    return {
      ...airport,
      country: countryInfo ? countryInfo.country : airport.country, // Fallback to original code if not found
    };
  });

  fs.writeFileSync(jsonFilePath, JSON.stringify(updatedAirports, null, 2));

  console.log('Successfully updated airports.json with full country names.');

} catch (error) {
  console.error('Error updating airports.json:', error);
} 