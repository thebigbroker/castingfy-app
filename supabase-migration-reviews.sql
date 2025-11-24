-- Create reviews table for talent profiles
CREATE TABLE IF NOT EXISTS talent_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  project_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_review UNIQUE (talent_user_id, reviewer_user_id)
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_talent_reviews_talent_user_id ON talent_reviews(talent_user_id);
CREATE INDEX IF NOT EXISTS idx_talent_reviews_reviewer_user_id ON talent_reviews(reviewer_user_id);
CREATE INDEX IF NOT EXISTS idx_talent_reviews_created_at ON talent_reviews(created_at DESC);

-- Add RLS policies
ALTER TABLE talent_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view reviews
CREATE POLICY "Talent reviews are viewable by everyone"
  ON talent_reviews FOR SELECT
  USING (true);

-- Policy: Only producers/agencies can create reviews (not talent reviewing talent)
CREATE POLICY "Producers can create reviews"
  ON talent_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_user_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'productor'
    )
    AND reviewer_user_id != talent_user_id
  );

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON talent_reviews FOR UPDATE
  USING (auth.uid() = reviewer_user_id)
  WITH CHECK (auth.uid() = reviewer_user_id);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON talent_reviews FOR DELETE
  USING (auth.uid() = reviewer_user_id);

-- Add updated_at trigger
CREATE TRIGGER update_talent_reviews_updated_at BEFORE UPDATE ON talent_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add column to talent_profiles for average rating (denormalized for performance)
ALTER TABLE talent_profiles ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0;
ALTER TABLE talent_profiles ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Function to update talent average rating
CREATE OR REPLACE FUNCTION update_talent_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE talent_profiles
  SET
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM talent_reviews
      WHERE talent_user_id = COALESCE(NEW.talent_user_id, OLD.talent_user_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM talent_reviews
      WHERE talent_user_id = COALESCE(NEW.talent_user_id, OLD.talent_user_id)
    )
  WHERE user_id = COALESCE(NEW.talent_user_id, OLD.talent_user_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger to automatically update rating when reviews change
CREATE TRIGGER update_talent_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON talent_reviews
FOR EACH ROW EXECUTE FUNCTION update_talent_rating();

COMMENT ON TABLE talent_reviews IS 'Reviews and testimonials for talent profiles - only from producers/agencies';
COMMENT ON COLUMN talent_reviews.talent_user_id IS 'FK to users - the talent being reviewed';
COMMENT ON COLUMN talent_reviews.reviewer_user_id IS 'FK to users - the producer/agency giving the review';
COMMENT ON COLUMN talent_reviews.rating IS 'Rating from 1 to 5 stars';
COMMENT ON COLUMN talent_reviews.review_text IS 'The review text/testimonial';
COMMENT ON COLUMN talent_reviews.project_name IS 'Optional project name the review is related to';
