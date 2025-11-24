-- Create gallery_images table for talent portfolios
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_gallery_images_user_id ON gallery_images(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(user_id, display_order);

-- Add RLS policies
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view gallery images
CREATE POLICY "Gallery images are viewable by everyone"
  ON gallery_images FOR SELECT
  USING (true);

-- Policy: Users can insert their own gallery images
CREATE POLICY "Users can insert their own gallery images"
  ON gallery_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own gallery images
CREATE POLICY "Users can update their own gallery images"
  ON gallery_images FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own gallery images
CREATE POLICY "Users can delete their own gallery images"
  ON gallery_images FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE gallery_images IS 'Gallery images for talent portfolios - publicly viewable';
COMMENT ON COLUMN gallery_images.user_id IS 'FK to users table - the talent who owns this image';
COMMENT ON COLUMN gallery_images.image_url IS 'URL to the uploaded image';
COMMENT ON COLUMN gallery_images.title IS 'Optional title for the image';
COMMENT ON COLUMN gallery_images.description IS 'Optional description for the image';
COMMENT ON COLUMN gallery_images.display_order IS 'Order for displaying images in gallery';
COMMENT ON COLUMN gallery_images.is_cover IS 'Whether this image is the cover/featured image';
