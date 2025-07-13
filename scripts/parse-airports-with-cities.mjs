import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';
import iso31661 from 'iso-3166-1';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const projectRoot = path.resolve(__dirname, '..');

const csvFilePath = path.join(projectRoot, 'src', 'lib', 'airports-fly.csv');
const jsonFilePath = path.join(projectRoot, 'src', 'lib', 'airports.json');

try {
  console.log(`Reading CSV from: ${csvFilePath}`);
  const csvData = fs.readFileSync(csvFilePath, 'utf8');

  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`Found ${records.length} records in CSV.`);

  const airports = records
    .filter(record => record.iata_code && record.type !== 'closed' && record.scheduled_service === 'yes' && record.municipality)
    .map(record => {
        const countryInfo = iso31661.whereAlpha2(record.iso_country);
        return {
            name: record.name,
            code: record.iata_code,
            city: record.municipality,
            country: countryInfo ? countryInfo.country : record.iso_country,
            lat: parseFloat(record.latitude_deg),
            lon: parseFloat(record.longitude_deg)
        }
    });

  console.log(`Filtered down to ${airports.length} active airports with IATA codes and municipalities.`);

  fs.writeFileSync(jsonFilePath, JSON.stringify(airports, null, 2));

  console.log(`Successfully created airports.json at: ${jsonFilePath}`);

} catch (error) {
  console.error('Error processing CSV file:', error);
} 