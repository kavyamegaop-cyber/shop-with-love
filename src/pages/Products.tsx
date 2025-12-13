import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/products/ProductCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "All Categories",
    "Writing",
    "Mathematics",
    "Electronics",
    "Stationery",
    "Art Supplies",
    "Books"
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="text-sm text-gray-600">
              <a href="/" className="hover:text-orange-600">Home</a> / All Products
            </div>
          </div>
        </div>

        {/* Products Section */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <div className="bg-white border rounded p-4 sticky top-32">
                  <h3 className="font-bold text-lg mb-4">Category</h3>
                  <div className="space-y-2">
                    <div 
                      className={`cursor-pointer hover:text-orange-600 ${
                        selectedCategory === 'all' ? 'font-bold text-orange-600' : ''
                      }`}
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Products
                    </div>
                    <div 
                      className={`cursor-pointer hover:text-orange-600 ${
                        selectedCategory === 'Writing' ? 'font-bold text-orange-600' : ''
                      }`}
                      onClick={() => setSelectedCategory('Writing')}
                    >
                      Writing
                    </div>
                    <div 
                      className={`cursor-pointer hover:text-orange-600 ${
                        selectedCategory === 'Mathematics' ? 'font-bold text-orange-600' : ''
                      }`}
                      onClick={() => setSelectedCategory('Mathematics')}
                    >
                      Mathematics
                    </div>
                    <div 
                      className={`cursor-pointer hover:text-orange-600 ${
                        selectedCategory === 'Electronics' ? 'font-bold text-orange-600' : ''
                      }`}
                      onClick={() => setSelectedCategory('Electronics')}
                    >
                      Electronics
                    </div>
                    <div 
                      className={`cursor-pointer hover:text-orange-600 ${
                        selectedCategory === 'Stationery' ? 'font-bold text-orange-600' : ''
                      }`}
                      onClick={() => setSelectedCategory('Stationery')}
                    >
                      Stationery
                    </div>
                    <div 
                      className={`cursor-pointer hover:text-orange-600 ${
                        selectedCategory === 'Art Supplies' ? 'font-bold text-orange-600' : ''
                      }`}
                      onClick={() => setSelectedCategory('Art Supplies')}
                    >
                      Art Supplies
                    </div>
                    <div 
                      className={`cursor-pointer hover:text-orange-600 ${
                        selectedCategory === 'Books' ? 'font-bold text-orange-600' : ''
                      }`}
                      onClick={() => setSelectedCategory('Books')}
                    >
                      Books
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-4">
                {/* Header */}
                <div className="bg-white border rounded p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">
                      {selectedCategory === "all" 
                        ? `All Products (${filteredProducts.length} items)`
                        : `${selectedCategory} (${filteredProducts.length} items)`
                      }
                    </h1>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48 lg:hidden">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Writing">Writing</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Stationery">Stationery</SelectItem>
                        <SelectItem value="Art Supplies">Art Supplies</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Products Grid */}
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="bg-white border rounded p-4 space-y-4">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border rounded p-16 text-center">
                    <p className="text-xl text-gray-600">
                      No products found in this category.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
