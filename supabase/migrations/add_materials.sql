-- Add materials column to gig_packs table
-- Materials stores an array of links to gig-related resources:
-- rehearsal recordings, performance recordings, charts, reference tracks, etc.

ALTER TABLE gig_packs
ADD COLUMN IF NOT EXISTS materials jsonb DEFAULT '[]'::jsonb;

-- Add a comment to document the column
COMMENT ON COLUMN gig_packs.materials IS 'Array of GigMaterial objects with id, label, url, and kind fields';

