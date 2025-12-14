import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number | string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const rating = 4;
  const reviews = Math.floor(Math.random() * 500) + 100;

  return (
    <div className="bg-white border rounded-sm hover:shadow-lg transition-shadow p-4 cursor-pointer group">
      {/* Image Container */}
      <div className="relative aspect-square bg-white overflow-hidden mb-3 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-sm line-clamp-2 text-gray-900 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-blue-600 ml-1">{reviews}</span>
        </div>

        {/* Prime Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white bg-blue-400 px-2 py-0.5 rounded">Fast Delivery</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xs">₹</span>
          <span className="text-2xl font-medium">{product.price}</span>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-medium rounded-full"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
