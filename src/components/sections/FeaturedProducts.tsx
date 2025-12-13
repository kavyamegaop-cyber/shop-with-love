import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // @ts-ignore - Supabase types will work after running migration
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(4);

      if (error) {
        console.error("Error fetching products:", error);
        // Fallback to static data
        setProducts([
          {
            id: 1,
            name: "Premium Pencil Kit",
            price: 299,
            category: "Writing",
            image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80",
          },
          {
            id: 2,
            name: "Geometry Box Set",
            price: 399,
            category: "Mathematics",
            image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80",
          },
          {
            id: 3,
            name: "Scientific Calculator",
            price: 1299,
            category: "Electronics",
            image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&q=80",
          },
          {
            id: 4,
            name: "Student Notebook Set",
            price: 249,
            category: "Stationery",
            image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
          },
        ]);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="new" className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p>Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular School Essentials</h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <a
            href="/products"
            className="text-blue-600 hover:text-orange-600 hover:underline font-medium"
          >
            See all products
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
