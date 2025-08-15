-- Create seo_meta table for storing SEO metadata
CREATE TABLE IF NOT EXISTS seo_meta (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_title TEXT DEFAULT 'FlyLuxSky — Business Flights',
  site_description TEXT DEFAULT 'Your Gateway to Exclusive Business Class Savings',
  site_keywords TEXT DEFAULT 'business class flights, luxury travel, premium flights, first class',
  og_title TEXT DEFAULT 'FlyLuxSky — Business Flights',
  og_description TEXT DEFAULT 'Your Gateway to Exclusive Business Class Savings',
  og_image TEXT DEFAULT '/og.png',
  og_url TEXT DEFAULT 'https://flyluxsky.vercel.app/',
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_title TEXT DEFAULT 'FlyLuxSky — Business Flights',
  twitter_description TEXT DEFAULT 'Your Gateway to Exclusive Business Class Savings',
  twitter_image TEXT DEFAULT '/og.png',
  robots_txt TEXT DEFAULT 'User-agent: *\nAllow: /',
  canonical_url TEXT DEFAULT 'https://flyluxsky.vercel.app/',
  author TEXT DEFAULT 'FlyLuxSky',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row
INSERT INTO seo_meta (id) VALUES (1) ON CONFLICT (id) DO NOTHING;