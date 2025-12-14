import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Checkout = () => {
  const { cart, totalPrice, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // @ts-ignore - Supabase types will work after running migration
      // @ts-expect-error - Type inference issue with Supabase types
      const { error } = await supabase.from("orders").insert({
        customer_name: formData.name,
        customer_mobile: formData.mobile,
        customer_address: formData.address,
        items: cart,
        total_amount: totalPrice,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Order Placed Successfully!",
        description: "We'll contact you shortly to confirm your order.",
      });

      clearCart();
      setFormData({ name: "", mobile: "", address: "" });
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="font-serif text-4xl mb-6">Your Cart is Empty</h1>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-24">
        <h1 className="font-serif text-4xl md:text-5xl mb-12 text-center">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Order Summary */}
          <div>
            <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
            <div className="bg-card p-6 rounded-lg space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4 border-b pb-3">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-accent/10 border border-accent rounded-lg">
              <p className="text-sm font-medium">📍 Service Area</p>
              <p className="text-sm text-muted-foreground mt-1">
                Chinchwad, Pune and nearby localities only
              </p>
            </div>
          </div>

          {/* Customer Details Form */}
          <div>
            <h2 className="font-serif text-2xl mb-6">Delivery Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mobile Number *</label>
                <Input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete address in Chinchwad or nearby area"
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Note: We only deliver to Chinchwad, Pune and nearby localities
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Our team will contact you on {formData.mobile || "your mobile"} to confirm the order
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
