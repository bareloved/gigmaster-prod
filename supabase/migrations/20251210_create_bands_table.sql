-- Create bands table for managing multiple bands per user
-- Each band has its own branding (logo, colors, poster skin) and default lineup

CREATE TABLE bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  band_logo_url TEXT,
  hero_image_url TEXT,
  accent_color TEXT,
  poster_skin TEXT DEFAULT 'paper',
  default_lineup JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient queries by owner
CREATE INDEX idx_bands_owner_id ON bands(owner_id);

-- Enable Row Level Security
ALTER TABLE bands ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own bands
CREATE POLICY "Users can view own bands"
  ON bands FOR SELECT
  USING (auth.uid() = owner_id);

-- Policy: Users can insert their own bands
CREATE POLICY "Users can create own bands"
  ON bands FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can update their own bands
CREATE POLICY "Users can update own bands"
  ON bands FOR UPDATE
  USING (auth.uid() = owner_id);

-- Policy: Users can delete their own bands
CREATE POLICY "Users can delete own bands"
  ON bands FOR DELETE
  USING (auth.uid() = owner_id);

-- Add comment for documentation
COMMENT ON TABLE bands IS 'Stores band information including branding and default lineup members. Each user can have multiple bands.';
COMMENT ON COLUMN bands.default_lineup IS 'Array of LineupMember objects (role, name, notes) that auto-populate when creating gigs for this band.';

