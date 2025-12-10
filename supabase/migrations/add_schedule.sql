-- Add schedule column to gig_packs table
-- Schedule stores an array of timeline items for the gig day:
-- soundcheck, doors open, showtime, etc.

ALTER TABLE gig_packs
ADD COLUMN IF NOT EXISTS schedule jsonb DEFAULT '[]'::jsonb;

-- Add a comment to document the column
COMMENT ON COLUMN gig_packs.schedule IS 'Array of GigScheduleItem objects with id, time, and label fields';


