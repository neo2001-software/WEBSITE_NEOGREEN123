import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Shield, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderChatWidget from "@/components/OrderChatWidget";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Order = () => {
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    packaging: "",
    destination: "",
    incoterms: "",
    deliveryDate: "",
    buyerName: "",
    company: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    // Auto-fill product from URL parameter
    const params = new URLSearchParams(window.location.search);
    const productParam = params.get("product");
    if (productParam) {
      setFormData(prev => ({ ...prev, product: productParam }));
      setSelectedProduct(productParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.product || !formData.quantity || !formData.destination || !formData.buyerName || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          product: formData.product,
          quantity: formData.quantity,
          packaging: formData.packaging || null,
          destination: formData.destination,
          incoterms: formData.incoterms || null,
          delivery_date: formData.deliveryDate || null,
          buyer_name: formData.buyerName,
          company: formData.company || null,
          email: formData.email,
          phone: formData.phone || null,
          notes: formData.notes || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Order submitted successfully!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = () => {
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  const getPackagingOptions = (product: string) => {
    if (product.includes("Chili")) {
      return ["5kg export carton (Fresh)", "10kg export carton (Fresh)", "25kg export carton (Fresh)", "5kg export carton (Dried)", "10kg export carton (Dried)", "25kg export carton (Dried)"];
    } else if (product.includes("Compost")) {
      return ["5kg bags", "25kg bags"];
    } else if (product.includes("Cocopeat")) {
      return ["5kg blocks (Washed)", "25kg blocks (Washed)", "5kg blocks (Unwashed)", "25kg blocks (Unwashed)"];
    }
    return [];
  };

  const getProductInfo = (product: string) => {
    if (product.includes("Chili")) {
      return {
        title: "Premium Chili (Hot Dragon F1 / Scotch Bonnet)",
        description: "Export-quality chilies grown in semi-protected polytunnels. Fresh or dried. Standard packs: 5kg / 10kg / 25kg export cartons.",
        hsCode: "HS Code: 070960 (fresh) / 090420 (dried)"
      };
    } else if (product.includes("Compost")) {
      return {
        title: "Organic Worm Compost",
        description: "100% organic, microbial-rich vermicompost. Packs: 5kg / 25kg bags.",
        hsCode: "HS Code: 310100"
      };
    } else if (product.includes("Cocopeat")) {
      return {
        title: "Premium Cocopeat",
        description: "High water retention & aeration. Blocks: 5kg / 25kg. Options: Washed / Unwashed.",
        hsCode: "HS Code: 530500"
      };
    }
    return null;
  };

  const generateWhatsAppLink = () => {
    const productName = formData.product || "[PRODUCT]";
    const whatsappText = `Hello NeoGreen! I'd like to order ${productName} — Quantity: [___] Packaging: [___] Destination: [___]`;
    return `https://wa.me/94775112541?text=${encodeURIComponent(whatsappText)}`;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quote Request Submitted!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thanks! Your request has been sent. Our export team will reply within 24 hours.
            </p>
            <Button 
              onClick={() => window.location.href = "/"}
              className="bg-gradient-nature hover:opacity-90 text-white"
            >
              Return to Homepage
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const productInfo = getProductInfo(formData.product);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 lg:py-24 bg-gradient-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Request a Quote / Place an Order
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tell us what you need—we'll reply with pricing, lead times, and shipping options within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Info (if selected) */}
            {productInfo && (
              <div className="lg:col-span-1">
                <Card className="p-6 shadow-medium">
                  <h3 className="text-xl font-bold text-foreground mb-4">{productInfo.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{productInfo.description}</p>
                  <Badge variant="outline" className="text-xs">{productInfo.hsCode}</Badge>
                </Card>
              </div>
            )}

            {/* Order Form */}
            <Card className={`p-8 shadow-medium ${productInfo ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="product" className="text-sm font-medium text-foreground">
                      Product *
                    </Label>
                    <Input
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={(e) => handleChange("product", e.target.value)}
                      placeholder="Enter product name"
                      readOnly={!!selectedProduct}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantity" className="text-sm font-medium text-foreground">
                      Quantity * <span className="text-xs text-muted-foreground">(kg / bags / blocks)</span>
                    </Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleChange("quantity", e.target.value)}
                      placeholder="Enter quantity"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="packaging" className="text-sm font-medium text-foreground">
                      Packaging
                    </Label>
                    <Select value={formData.packaging} onValueChange={(value) => handleChange("packaging", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select packaging" />
                      </SelectTrigger>
                      <SelectContent>
                        {getPackagingOptions(formData.product).map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="destination" className="text-sm font-medium text-foreground">
                      Destination Country *
                    </Label>
                    <Input
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={(e) => handleChange("destination", e.target.value)}
                      placeholder="Enter destination country"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="incoterms" className="text-sm font-medium text-foreground">
                      Incoterms
                    </Label>
                    <Select value={formData.incoterms} onValueChange={(value) => handleChange("incoterms", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select incoterms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXW">EXW (Ex Works)</SelectItem>
                        <SelectItem value="FOB">FOB (Free on Board)</SelectItem>
                        <SelectItem value="CIF">CIF (Cost, Insurance & Freight)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="deliveryDate" className="text-sm font-medium text-foreground">
                      Target Delivery Date
                    </Label>
                    <Input
                      id="deliveryDate"
                      name="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => handleChange("deliveryDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="buyerName" className="text-sm font-medium text-foreground">
                      Buyer Name *
                    </Label>
                    <Input
                      id="buyerName"
                      name="buyerName"
                      value={formData.buyerName}
                      onChange={(e) => handleChange("buyerName", e.target.value)}
                      placeholder="Enter your name"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-sm font-medium text-foreground">
                      Company
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="Enter company name"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="Enter email address"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone / WhatsApp
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-foreground">
                    Notes / Specifications
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Any additional requirements or specifications..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-nature hover:opacity-90 text-white"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Request Quote"}
                  </Button>

                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/5"
                    size="lg"
                    onClick={() => window.open(generateWhatsAppLink(), '_blank')}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    Order on WhatsApp
                  </Button>
                </div>

                {/* Trust Cues */}
                <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-border">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    Quality-controlled
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Package className="w-4 h-4 mr-2 text-primary" />
                    Sustainable Farming
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Truck className="w-4 h-4 mr-2 text-primary" />
                    Export-ready Packaging
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <OrderChatWidget
        onUpdateForm={handleChange}
        onSubmit={handleFormSubmit}
        formData={{
          product: formData.product,
          quantity: formData.quantity,
          packaging: formData.packaging,
          destination: formData.destination,
          incoterms: formData.incoterms,
          deliveryDate: formData.deliveryDate,
          buyerName: formData.buyerName,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes
        }}
      />
    </div>
  );
};

export default Order;