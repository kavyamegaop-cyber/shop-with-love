-- Create products table
 
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_mobile TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Insert sample products
INSERT INTO products (name, description, price, category, image, stock) VALUES
('Premium Pencil Kit', 'High-quality pencil set with HB, 2B, 4B, and 6B pencils', 299.00, 'Writing', 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80', 50),
('Geometry Box Set', 'Complete geometry set with compass, protractor, rulers, and set squares', 399.00, 'Mathematics', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80', 35),
('Scientific Calculator', 'Advanced scientific calculator for higher mathematics', 1299.00, 'Electronics', 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&q=80', 20),
('Student Notebook Set', 'Pack of 5 quality notebooks with 200 pages each', 249.00, 'Stationery', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80', 100),
('Color Pencil Set', '24 vibrant colors for art and craft', 349.00, 'Art Supplies', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80', 45),
('Exam Pad Bundle', 'Premium quality exam pads - pack of 10', 199.00, 'Stationery', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80', 80);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read access)
CREATE POLICY "Allow public read access to products" 
  ON products FOR SELECT 
  USING (true);

-- Create policies for orders (public can insert, no read without auth)
CREATE POLICY "Allow public to insert orders" 
  ON orders FOR INSERT 
  WITH CHECK (true);

-- For development, allow reading orders (in production, you'd want proper authentication)
CREATE POLICY "Allow public to read orders" 
  ON orders FOR SELECT 
  USING (true);

CREATE POLICY "Allow public to update orders" 
  ON orders FOR UPDATE 
  USING (true);
