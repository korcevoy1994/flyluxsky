import fs from 'fs';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Путь к CSV файлу
const csvPath = join(__dirname, '..', 'src', 'lib', 'airports-fly.csv');
const outputPath = join(__dirname, '..', 'src', 'lib', 'airports.json');

// Функция для получения названия страны по коду
const getCountryName = (countryCode) => {
  const countries = {
    'US': 'United States',
    'CA': 'Canada',
    'GB': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'ES': 'Spain',
    'JP': 'Japan',
    'AU': 'Australia',
    'BR': 'Brazil',
    'CN': 'China',
    'IN': 'India',
    'RU': 'Russia',
    'MX': 'Mexico',
    'AR': 'Argentina',
    'CL': 'Chile',
    'CO': 'Colombia',
    'PE': 'Peru',
    'EC': 'Ecuador',
    'VE': 'Venezuela',
    'UY': 'Uruguay',
    'PY': 'Paraguay',
    'BO': 'Bolivia',
    'GY': 'Guyana',
    'SR': 'Suriname',
    'GF': 'French Guiana',
    'NL': 'Netherlands',
    'BE': 'Belgium',
    'AT': 'Austria',
    'CH': 'Switzerland',
    'PT': 'Portugal',
    'GR': 'Greece',
    'TR': 'Turkey',
    'EG': 'Egypt',
    'MA': 'Morocco',
    'DZ': 'Algeria',
    'TN': 'Tunisia',
    'ZA': 'South Africa',
    'KE': 'Kenya',
    'TZ': 'Tanzania',
    'UG': 'Uganda',
    'ET': 'Ethiopia',
    'GH': 'Ghana',
    'NG': 'Nigeria',
    'CM': 'Cameroon',
    'CI': 'Côte d\'Ivoire',
    'SN': 'Senegal',
    'ML': 'Mali',
    'BF': 'Burkina Faso',
    'NE': 'Niger',
    'TD': 'Chad',
    'CF': 'Central African Republic',
    'CD': 'Democratic Republic of the Congo',
    'CG': 'Republic of the Congo',
    'GA': 'Gabon',
    'GQ': 'Equatorial Guinea',
    'ST': 'São Tomé and Príncipe',
    'AO': 'Angola',
    'ZM': 'Zambia',
    'ZW': 'Zimbabwe',
    'BW': 'Botswana',
    'NA': 'Namibia',
    'SZ': 'Eswatini',
    'LS': 'Lesotho',
    'MG': 'Madagascar',
    'MU': 'Mauritius',
    'SC': 'Seychelles',
    'KM': 'Comoros',
    'DJ': 'Djibouti',
    'SO': 'Somalia',
    'ER': 'Eritrea',
    'SD': 'Sudan',
    'SS': 'South Sudan',
    'LY': 'Libya',
    'TH': 'Thailand',
    'VN': 'Vietnam',
    'KH': 'Cambodia',
    'LA': 'Laos',
    'MM': 'Myanmar',
    'MY': 'Malaysia',
    'SG': 'Singapore',
    'ID': 'Indonesia',
    'PH': 'Philippines',
    'BN': 'Brunei',
    'TL': 'East Timor',
    'KR': 'South Korea',
    'KP': 'North Korea',
    'MN': 'Mongolia',
    'KZ': 'Kazakhstan',
    'UZ': 'Uzbekistan',
    'TM': 'Turkmenistan',
    'KG': 'Kyrgyzstan',
    'TJ': 'Tajikistan',
    'AF': 'Afghanistan',
    'PK': 'Pakistan',
    'BD': 'Bangladesh',
    'LK': 'Sri Lanka',
    'MV': 'Maldives',
    'NP': 'Nepal',
    'BT': 'Bhutan',
    'IR': 'Iran',
    'IQ': 'Iraq',
    'SY': 'Syria',
    'LB': 'Lebanon',
    'IL': 'Israel',
    'PS': 'Palestine',
    'JO': 'Jordan',
    'SA': 'Saudi Arabia',
    'YE': 'Yemen',
    'OM': 'Oman',
    'AE': 'United Arab Emirates',
    'QA': 'Qatar',
    'BH': 'Bahrain',
    'KW': 'Kuwait',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'IS': 'Iceland',
    'EE': 'Estonia',
    'LV': 'Latvia',
    'LT': 'Lithuania',
    'PL': 'Poland',
    'CZ': 'Czech Republic',
    'SK': 'Slovakia',
    'HU': 'Hungary',
    'SI': 'Slovenia',
    'HR': 'Croatia',
    'BA': 'Bosnia and Herzegovina',
    'RS': 'Serbia',
    'ME': 'Montenegro',
    'XK': 'Kosovo',
    'MK': 'North Macedonia',
    'AL': 'Albania',
    'BG': 'Bulgaria',
    'RO': 'Romania',
    'MD': 'Moldova',
    'UA': 'Ukraine',
    'BY': 'Belarus',
    'IE': 'Ireland',
    'MT': 'Malta',
    'CY': 'Cyprus',
    'LU': 'Luxembourg',
    'MC': 'Monaco',
    'AD': 'Andorra',
    'SM': 'San Marino',
    'VA': 'Vatican City',
    'LI': 'Liechtenstein',
    'FO': 'Faroe Islands',
    'GL': 'Greenland',
    'SJ': 'Svalbard and Jan Mayen',
    'AX': 'Åland Islands',
    'GI': 'Gibraltar',
    'JE': 'Jersey',
    'GG': 'Guernsey',
    'IM': 'Isle of Man',
    'FK': 'Falkland Islands',
    'GS': 'South Georgia and the South Sandwich Islands',
    'SH': 'Saint Helena',
    'TC': 'Turks and Caicos Islands',
    'AI': 'Anguilla',
    'BM': 'Bermuda',
    'VG': 'British Virgin Islands',
    'KY': 'Cayman Islands',
    'MS': 'Montserrat',
    'PN': 'Pitcairn Islands',
    'IO': 'British Indian Ocean Territory',
    'TF': 'French Southern Territories',
    'PF': 'French Polynesia',
    'NC': 'New Caledonia',
    'WF': 'Wallis and Futuna',
    'YT': 'Mayotte',
    'RE': 'Réunion',
    'PM': 'Saint Pierre and Miquelon',
    'BL': 'Saint Barthélemy',
    'MF': 'Saint Martin',
    'GP': 'Guadeloupe',
    'MQ': 'Martinique',
    'CW': 'Curaçao',
    'AW': 'Aruba',
    'SX': 'Sint Maarten',
    'BQ': 'Bonaire, Sint Eustatius and Saba',
    'PR': 'Puerto Rico',
    'VI': 'U.S. Virgin Islands',
    'GU': 'Guam',
    'AS': 'American Samoa',
    'MP': 'Northern Mariana Islands',
    'UM': 'United States Minor Outlying Islands',
    'WS': 'Samoa',
    'TO': 'Tonga',
    'FJ': 'Fiji',
    'VU': 'Vanuatu',
    'SB': 'Solomon Islands',
    'PG': 'Papua New Guinea',
    'NR': 'Nauru',
    'KI': 'Kiribati',
    'TV': 'Tuvalu',
    'CK': 'Cook Islands',
    'NU': 'Niue',
    'TK': 'Tokelau',
    'PW': 'Palau',
    'FM': 'Micronesia',
    'MH': 'Marshall Islands',
    'NZ': 'New Zealand',
    'CC': 'Cocos (Keeling) Islands',
    'CX': 'Christmas Island',
    'HM': 'Heard Island and McDonald Islands',
    'NF': 'Norfolk Island',
    'AQ': 'Antarctica',
    'BV': 'Bouvet Island',
    'HK': 'Hong Kong',
    'MO': 'Macao',
    'TW': 'Taiwan',
  };
  
  return countries[countryCode] || countryCode;
};

const processAirports = async () => {
  console.log('🚀 Начинаю обработку аэропортов...');
  
  const airports = [];
  
  try {
    const csvData = fs.readFileSync(csvPath, 'utf8');
    
    await new Promise((resolve, reject) => {
      parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      }, (err, records) => {
        if (err) {
          reject(err);
          return;
        }
        
        for (const record of records) {
          // Фильтруем только аэропорты с IATA кодом и scheduled_service = yes
          if (record.iata_code && record.iata_code.trim() !== '' && 
              record.scheduled_service === 'yes' && 
              record.type && (record.type.includes('airport') || record.type === 'large_airport' || record.type === 'medium_airport')) {
            
            const airportName = record.name || record.municipality || 'Unknown Airport';
            const city = record.municipality || record.name || 'Unknown City';
            const country = getCountryName(record.iso_country) || '';
            const code = record.iata_code.trim();
            
            // Создаем объект аэропорта
            const airport = {
              name: airportName,
              code: code,
              city: city,
              country: country,
              countryCode: record.iso_country,
              lat: parseFloat(record.latitude_deg) || 0,
              lon: parseFloat(record.longitude_deg) || 0
            };
            
            airports.push(airport);
          }
        }
        
        resolve(null);
      });
    });
    
    // Сортируем по названию
    airports.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`✅ Обработано ${airports.length} аэропортов`);
    
    // Сохраняем в JSON файл
    fs.writeFileSync(outputPath, JSON.stringify(airports, null, 2));
    
    console.log(`💾 Данные сохранены в ${outputPath}`);
    console.log(`📊 Примеры аэропортов:`);
    
    // Показываем первые 10 аэропортов
    airports.slice(0, 10).forEach(airport => {
      console.log(`   • ${airport.name} (${airport.code}) - ${airport.city}, ${airport.country}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при обработке:', error.message);
    process.exit(1);
  }
};

processAirports(); 