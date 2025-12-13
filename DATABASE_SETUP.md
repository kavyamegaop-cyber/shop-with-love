# Database Setup Instructions

## Setting up Supabase Tables

To set up the database tables for this e-commerce site, follow these steps:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the **SQL Editor** tab
3. Copy the contents of `supabase/migrations/001_create_tables.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute the migration

This will create:
- `products` table with sample school essentials
- `orders` table for customer orders
- Proper indexes and Row Level Security policies

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your project
supabase link --project-ref jbhucseroxiqxwpnrksr

# Apply migrations
supabase db push
```

## Verify Setup

After running the migration, verify in your Supabase dashboard:

1. Go to **Table Editor**
2. You should see two tables: `products` and `orders`
3. The `products` table should have 6 sample products pre-populated

## Admin Panel Access

- URL: http://localhost:8080/admin
- Password: `2009kavya`

## Service Area

This store serves:
- Chinchwad, Pune
- Nearby localities only

Contact: 9309496280

## Features

✅ Product catalog with Supabase integration
✅ Shopping cart functionality
✅ Professional checkout page
✅ Order management
✅ Admin panel for order tracking
✅ Student-friendly theme
✅ Service area validation
