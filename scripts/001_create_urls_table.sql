-- Create the urls table for storing shortened URLs
CREATE TABLE IF NOT EXISTS urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast lookups by short_code
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);

-- Create index for checking expired URLs
CREATE INDEX IF NOT EXISTS idx_urls_expires_at ON urls(expires_at);

-- Enable Row Level Security (public access for this simple URL shortener)
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for redirects)
CREATE POLICY "Allow public read access" ON urls FOR SELECT USING (true);

-- Allow public insert (anyone can create short URLs)
CREATE POLICY "Allow public insert" ON urls FOR INSERT WITH CHECK (true);

-- Allow public update (for incrementing click count)
CREATE POLICY "Allow public update" ON urls FOR UPDATE USING (true);

-- Allow public delete (for deleting expired or user-deleted URLs)
CREATE POLICY "Allow public delete" ON urls FOR DELETE USING (true);
