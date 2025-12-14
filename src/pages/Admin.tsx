import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, Plus, Save } from "lucide-react";

const ADMIN_PASSWORD = "2009kavya";

interface Order {
  id: number;
  customer_name: string;
  customer_mobile: string;
  customer_address: string;
  items: any[];
  total_amount: number;
  status: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string;
  stock: number | null;
  created_at: string | null;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });
  const [siteSettings, setSiteSettings] = useState({
    heroTitle: "Everything for Student Success",
    heroSubtitle: "Premium school essentials with fast delivery to Chinchwad, Pune and nearby areas",
    contactPhone: "9309496280",
    contactAddress: "Chinchwad, Pune",
    shopName: "SchoolShop",
  });
  const { toast} = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Welcome Admin",
        description: "Successfully logged in",
      });
      fetchOrders();
      fetchProducts();
      fetchSiteSettings();
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) throw error;
      if (data) {
        setSiteSettings({
          heroTitle: data.hero_title,
          heroSubtitle: data.hero_subtitle,
          contactPhone: data.contact_phone,
          contactAddress: data.contact_address,
          shopName: data.shop_name,
        });
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
    }
  };

  const saveSiteSettings = async () => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          hero_title: siteSettings.heroTitle,
          hero_subtitle: siteSettings.heroSubtitle,
          contact_phone: siteSettings.contactPhone,
          contact_address: siteSettings.contactAddress,
          shop_name: siteSettings.shopName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);

      if (error) throw error;

      toast({
        title: "Settings Saved!",
        description: "Site settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving site settings:", error);
      toast({
        title: "Save Failed",
        description: "Could not save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // @ts-ignore - Supabase types will work after running migration
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // @ts-ignore - Supabase types will work after running migration
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        // @ts-expect-error - Type inference issue with Supabase types  
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });

      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: productForm.name,
      description: productForm.description || null,
      price: parseFloat(productForm.price),
      category: productForm.category,
      image: productForm.image,
      stock: productForm.stock ? parseInt(productForm.stock) : 0,
    };

    try {
      if (editingProduct) {
        // Update existing product
        // @ts-ignore
        const { error } = await supabase
          .from("products")
          // @ts-expect-error - Type inference issue
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;

        toast({
          title: "Product Updated",
          description: "Product has been updated successfully",
        });
      } else {
        // Create new product
        // @ts-ignore
        const { error } = await supabase.from("products").insert(productData);

        if (error) throw error;

        toast({
          title: "Product Added",
          description: "New product has been added successfully",
        });
      }

      setIsProductDialogOpen(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock?.toString() || "0",
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // @ts-ignore
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Product Deleted",
        description: "Product has been removed successfully",
      });

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-card p-8 rounded-lg shadow-lg">
            <h1 className="font-serif text-3xl mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="font-serif text-2xl">Admin Dashboard</h1>
          <Button
            variant="secondary"
            onClick={() => {
              setIsAuthenticated(false);
              setPassword("");
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-8">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">Site Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-3xl">Orders Management</h2>
              <Button onClick={fetchOrders} disabled={loading}>
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No orders yet
              </div>
            ) : (
              <div className="bg-card rounded-lg shadow overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell>{order.customer_mobile}</TableCell>
                        <TableCell className="max-w-xs truncate">{order.customer_address}</TableCell>
                        <TableCell>
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="text-sm">
                              {item.name} x{item.quantity}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="font-medium">₹{order.total_amount}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="products">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-3xl">Products Management</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
                setIsProductDialogOpen(open);
                if (!open) resetProductForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingProduct
                        ? "Update the product details below"
                        : "Fill in the details to add a new product to your store"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name *</label>
                      <Input
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({ ...productForm, name: e.target.value })
                        }
                        placeholder="e.g., Premium Pencil Kit"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm({ ...productForm, description: e.target.value })
                        }
                        placeholder="Product description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) =>
                            setProductForm({ ...productForm, price: e.target.value })
                          }
                          placeholder="299.00"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                        <Input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) =>
                            setProductForm({ ...productForm, stock: e.target.value })
                          }
                          placeholder="50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value) =>
                          setProductForm({ ...productForm, category: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Writing">Writing</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Stationery">Stationery</SelectItem>
                          <SelectItem value="Art Supplies">Art Supplies</SelectItem>
                          <SelectItem value="Books">Books</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Image URL *</label>
                      <Input
                        type="url"
                        value={productForm.image}
                        onChange={(e) =>
                          setProductForm({ ...productForm, image: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/..."
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Use Unsplash or other image hosting services
                      </p>
                    </div>

                    {productForm.image && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Image Preview</label>
                        <img
                          src={productForm.image}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                          }}
                        />
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        {editingProduct ? "Update Product" : "Add Product"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsProductDialogOpen(false);
                          resetProductForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No products yet. Add your first product!
              </div>
            ) : (
              <div className="grid gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-lg shadow p-6 flex gap-6"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-serif text-xl font-medium">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {product.category}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{product.description || "No description"}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="font-medium text-lg">₹{product.price}</span>
                        <span className="text-muted-foreground">
                          Stock: {product.stock || 0}
                        </span>
                        <span className="text-muted-foreground">
                          Added: {new Date(product.created_at || "").toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-4xl">
              <h2 className="font-serif text-3xl mb-8">Site Settings</h2>
              
              <div className="space-y-8">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                    <span>🏠</span> Hero Section
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Shop Name</label>
                      <Input
                        value={siteSettings.shopName}
                        onChange={(e) => setSiteSettings({...siteSettings, shopName: e.target.value})}
                        placeholder="SchoolShop"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Hero Title</label>
                      <Input
                        value={siteSettings.heroTitle}
                        onChange={(e) => setSiteSettings({...siteSettings, heroTitle: e.target.value})}
                        placeholder="Everything for Student Success"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                      <Textarea
                        value={siteSettings.heroSubtitle}
                        onChange={(e) => setSiteSettings({...siteSettings, heroSubtitle: e.target.value})}
                        placeholder="Premium school essentials..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                    <span>📞</span> Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input
                        value={siteSettings.contactPhone}
                        onChange={(e) => setSiteSettings({...siteSettings, contactPhone: e.target.value})}
                        placeholder="9309496280"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <Input
                        value={siteSettings.contactAddress}
                        onChange={(e) => setSiteSettings({...siteSettings, contactAddress: e.target.value})}
                        placeholder="Chinchwad, Pune"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={saveSiteSettings}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Settings
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      const defaultSettings = {
                        heroTitle: "Everything for Student Success",
                        heroSubtitle: "Premium school essentials with fast delivery to Chinchwad, Pune and nearby areas",
                        contactPhone: "9309496280",
                        contactAddress: "Chinchwad, Pune",
                        shopName: "SchoolShop",
                      };
                      setSiteSettings(defaultSettings);
                      await saveSiteSettings();
                      toast({
                        title: "Settings Reset",
                        description: "All settings restored to default",
                      });
                    }}
                  >
                    Reset to Default
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground bg-blue-50 p-4 rounded">
                  💡 <strong>Tip:</strong> Changes are saved to the database and will be visible to all visitors immediately.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
