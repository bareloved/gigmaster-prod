-- Add band_id foreign key to gig_packs table
-- This allows gigs to reference a specific band and inherit its defaults

-- Add band_id column (nullable for backward compatibility)
ALTER TABLE gig_packs 
ADD COLUMN band_id UUID REFERENCES bands(id) ON DELETE SET NULL;

-- Add index for performance when querying gigs by band
CREATE INDEX idx_gig_packs_band_id ON gig_packs(band_id);

-- Add comment for documentation
COMMENT ON COLUMN gig_packs.band_id IS 'Optional reference to bands table. When set, gig inherits branding and lineup defaults from the band.';

-- Note: band_name column remains for backward compatibility with existing gigs
-- New gigs will use band_id + band.name instead

