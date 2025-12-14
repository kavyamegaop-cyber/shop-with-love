import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("SchoolShop");
  const [location, setLocation] = useState("Chinchwad, Pune");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .single();
        
        if (data) {
          setShopName(data.shop_name);
          setLocation(data.contact_address);
        }
      } catch (error) {
        console.log("Using default settings");
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      {/* Top Header - Dark */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#131921] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-2">
            {/* Logo */}
            <a href="/" className="flex items-center hover:border border-white p-2 transition-all">
              <div className="font-bold text-xl">
                {shopName}
              </div>
            </a>

            {/* Deliver to */}
            <div className="hidden lg:flex items-center gap-1 hover:border border-white p-2 cursor-pointer transition-all">
              <MapPin className="h-5 w-5" />
              <div className="text-xs">
                <div className="text-gray-300">Deliver to</div>
                <div className="font-bold">{location}</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl">
              <div className="flex">
                <select className="hidden md:block bg-gray-200 text-gray-900 px-2 rounded-l-md border-none outline-none text-sm">
                  <option>All</option>
                  <option>Writing</option>
                  <option>Mathematics</option>
                  <option>Stationery</option>
                  <option>Art Supplies</option>
                </select>
                <Input 
                  placeholder="Search for school essentials"
                  className="flex-1 border-none rounded-none focus-visible:ring-0 text-gray-900"
                />
                <Button className="bg-orange-400 hover:bg-orange-500 rounded-l-none rounded-r-md px-4">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Account */}
              <div className="hidden md:flex flex-col hover:border border-white p-2 cursor-pointer transition-all">
                <span className="text-xs">Hello, sign in</span>
                <span className="font-bold text-sm flex items-center">
                  Account & Lists <ChevronDown className="h-3 w-3 ml-1" />
                </span>
              </div>

              {/* Orders */}
              <div className="hidden md:flex flex-col hover:border border-white p-2 cursor-pointer transition-all"
                onClick={() => navigate("/admin")}>
                <span className="text-xs">Returns</span>
                <span className="font-bold text-sm">& Orders</span>
              </div>

              {/* Cart */}
              <div 
                className="flex items-center gap-2 hover:border border-white p-2 cursor-pointer transition-all relative"
                onClick={() => navigate("/checkout")}
              >
                <div className="relative">
                  <ShoppingCart className="h-8 w-8" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 left-4 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden md:block font-bold text-sm">Cart</span>
              </div>

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-[#232f3e] border-t border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-6 py-2 text-sm overflow-x-auto">
              <a href="/products" className="hover:border border-white px-2 py-1 whitespace-nowrap">All Products</a>
              <a href="#" className="hover:border border-white px-2 py-1 whitespace-nowrap">Today's Deals</a>
              <a href="#" className="hover:border border-white px-2 py-1 whitespace-nowrap">Customer Service</a>
              <a href="#" className="hover:border border-white px-2 py-1 whitespace-nowrap">Gift Ideas</a>
              <a href="#" className="hover:border border-white px-2 py-1 whitespace-nowrap">New Arrivals</a>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[110px]"></div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white h-full w-80 max-w-[80%]" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#232f3e] text-white p-4 font-bold">Browse Categories</div>
            <nav className="p-4">
              <a href="/products" className="block py-3 border-b hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>All Products</a>
              <a href="#" className="block py-3 border-b hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Writing</a>
              <a href="#" className="block py-3 border-b hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Mathematics</a>
              <a href="#" className="block py-3 border-b hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Stationery</a>
              <a href="#" className="block py-3 border-b hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Art Supplies</a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
