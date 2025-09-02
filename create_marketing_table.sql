-- Create marketing_codes table for storing tracking codes
CREATE TABLE IF NOT EXISTS marketing_codes (
  id INTEGER PRIMARY KEY DEFAULT 1,
  google_tag_manager TEXT DEFAULT '',
  google_analytics_4 TEXT DEFAULT '',
  google_search_console TEXT DEFAULT '',
  bing_webmaster_tools TEXT DEFAULT '',
  facebook_pixel TEXT DEFAULT '',
  google_ads_tag TEXT DEFAULT '',
  hotjar TEXT DEFAULT '',
  kommo_chat TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row
INSERT INTO marketing_codes (id) VALUES (1) ON CONFLICT (id) DO NOTHING;