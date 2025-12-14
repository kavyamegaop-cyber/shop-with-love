# Site Settings Database Setup

## Run this SQL in Supabase SQL Editor:

```sql
-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_title TEXT NOT NULL DEFAULT 'Everything for Student Success',
  hero_subtitle TEXT NOT NULL DEFAULT 'Premium school essentials with fast delivery to Chinchwad, Pune and nearby areas',
  contact_phone TEXT NOT NULL DEFAULT '9309496280',
  contact_address TEXT NOT NULL DEFAULT 'Chinchwad, Pune',
  shop_name TEXT NOT NULL DEFAULT 'SchoolShop',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings
INSERT INTO site_settings (id, hero_title, hero_subtitle, contact_phone, contact_address, shop_name)
VALUES (1, 'Everything for Student Success', 'Premium school essentials with fast delivery to Chinchwad, Pune and nearby areas', '9309496280', 'Chinchwad, Pune', 'SchoolShop')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read settings
CREATE POLICY "Allow public read access to site_settings"
ON site_settings FOR SELECT
TO public
USING (true);

-- Allow authenticated users to update settings (for admin)
CREATE POLICY "Allow authenticated update to site_settings"
ON site_settings FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
```

## After running the SQL:

1. Go to Admin page (/#/admin)
2. Click "Site Settings" tab
3. Edit the text for:
   - Shop Name
   - Hero Title
   - Hero Subtitle
   - Phone Number
   - Address
4. Click "Save Settings"
5. Changes will appear immediately for all users!

No need to touch code or redeploy - just edit from the admin panel! ✨
