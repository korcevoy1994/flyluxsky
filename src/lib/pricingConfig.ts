export const pricingConfig = {
  basePricePerKm: {
    shortHaul: 0.25, // < 500 km
    mediumHaul: 0.18, // < 2000 km
    longHaul: 0.12, // < 5000 km
    ultraLongHaul: 0.08, // >= 5000 km
  },
  premiumAirlineSurcharge: 1.4,
  classMultipliers: {
    'First class': 3.2,
    'Business class': 2.1,
    'Premium economy': 1.4,
    'Economy': 1.0,
  },
  fuelAndTaxes: {
    min: 0.1,
    max: 0.25,
  },
  usaInternationalPremium: {
    min: 1.8,
    max: 2.4,
  },
  marketVariation: {
    min: 0.8,
    max: 1.2,
  },
  minimumPrice: {
    internationalFromUsa: {
      'First class': 5000,
      'Business class': 2000,
      'Premium economy': 800,
      'Economy': 400,
    },
    standard: {
      'First class': 800,
      'Business class': 400,
      'Premium economy': 200,
      'Economy': 100,
    },
  },
};