import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle, Package, Shield, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderChatWidget from "@/components/OrderChatWidget";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ASIAN_COUNTRIES = [
  "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", "Brunei", 
  "Cambodia", "China", "Cyprus", "Georgia", "India", "Indonesia", "Iran", "Iraq", 
  "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", 
  "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea", "Oman", 
  "Pakistan", "Palestine", "Philippines", "Qatar", "Russia", "Saudi Arabia", "Singapore", 
  "South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan", "Thailand", "Timor-Leste", 
  "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"
];

const PRODUCT_OPTIONS = [
  { value: "Hot Dragon F1 (Chili)", label: "Hot Dragon F1 (Chili)" },
  { value: "Scotch Bonnet (Chili)", label: "Scotch Bonnet (Chili)" },
  { value: "Organic Worm Compost", label: "Organic Worm Compost" },
  { value: "Premium Cocopeat (cube)", label: "Premium Cocopeat (cube)" }
];

const PACKAGING_OPTIONS = ["1 kg", "2 kg", "3 kg", "10 kg", "20 kg", "50 kg"];

const Order = () => {
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    packaging: "",
    destination: "",
    buyerName: "",
    company: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productParam = params.get("product");
    
    if (productParam) {
      if (productParam === "compost") {
        setFormData(prev => ({ ...prev, product: "Organic Worm Compost" }));
      } else if (productParam === "cocopeat") {
        setFormData(prev => ({ ...prev, product: "Premium Cocopeat (cube)" }));
      }
      // For chili, leave empty so user can choose variety
    }
  }, []);

  const isCocopeat = formData.product === "Premium Cocopeat (cube)";
  const isChiliOrCompost = formData.product.includes("Chili") || formData.product === "Organic Worm Compost";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.product) newErrors.product = "Product is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (isCocopeat && (!Number.isInteger(Number(formData.quantity)) || Number(formData.quantity) <= 0)) {
      newErrors.quantity = "Quantity must be a positive integer (cubes)";
    }
    if (!formData.destination) newErrors.destination = "Destination Country is required";
    if (!formData.buyerName) newErrors.buyerName = "Buyer Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone) newErrors.phone = "Phone / WhatsApp is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    try {
      const quantityValue = parseInt(formData.quantity);
      const quantityUnit = isCocopeat ? "cubes" : "kg";

      const { error } = await supabase
        .from('orders')
        .insert({
          product: formData.product,
          quantity_value: quantityValue,
          quantity_unit: quantityUnit,
          packaging: isChiliOrCompost ? formData.packaging || null : null,
          destination_country: formData.destination,
          buyer_name: formData.buyerName,
          company: formData.company || null,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes || null,
          source: 'web',
          status: 'new'
        });

      if (error) throw error;

      toast.success("Quote request submitted successfully!");
      setIsSubmitted(true);

      // Generate and open WhatsApp link
      const whatsappMessage = generateWhatsAppMessage();
      const whatsappLink = `https://wa.me/94778829398?text=${encodeURIComponent(whatsappMessage)}`;
      
      const popup = window.open(whatsappLink, '_blank');
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup blocked, show link
        toast.info("Please click the WhatsApp button to complete your order.", {
          action: {
            label: "Open WhatsApp",
            onClick: () => window.open(whatsappLink, '_blank')
          }
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppMessage = () => {
    if (isCocopeat) {
      return `NeoGreen — Quote Request
Product: Premium Cocopeat (compressed cube)
Quantity: ${formData.quantity} cubes
Destination Country: ${formData.destination}
Buyer: ${formData.buyerName}${formData.company ? ` | Company: ${formData.company}` : ' | Company: —'}
Email: ${formData.email}
Phone/WhatsApp: ${formData.phone}`;
    } else {
      return `NeoGreen — Quote Request
Product: ${formData.product}
Quantity: ${formData.quantity} kg
Packaging: ${formData.packaging || '—'}
Destination Country: ${formData.destination}
Buyer: ${formData.buyerName}${formData.company ? ` | Company: ${formData.company}` : ' | Company: —'}
Email: ${formData.email}
Phone/WhatsApp: ${formData.phone}`;
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFormSubmit = () => {
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
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

          <Card className="p-8 shadow-medium">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="product" className="text-sm font-medium text-foreground">
                    Product *
                  </Label>
                  <Select value={formData.product} onValueChange={(value) => handleChange("product", value)}>
                    <SelectTrigger className={`mt-1 ${errors.product ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="— Select a product —" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {PRODUCT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.product && <p className="text-xs text-destructive mt-1">{errors.product}</p>}
                </div>

                <div>
                  <Label htmlFor="quantity" className="text-sm font-medium text-foreground">
                    Quantity * <span className="text-xs text-muted-foreground">({isCocopeat ? 'in cubes' : 'in kg'})</span>
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    placeholder={isCocopeat ? "Enter quantity in cubes" : "Enter quantity in kg"}
                    className={`mt-1 ${errors.quantity ? 'border-destructive' : ''}`}
                  />
                  {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity}</p>}
                </div>
              </div>

              {isChiliOrCompost && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="packaging" className="text-sm font-medium text-foreground">
                      Packaging
                    </Label>
                    <Select value={formData.packaging} onValueChange={(value) => handleChange("packaging", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select packaging" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {PACKAGING_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="destination" className="text-sm font-medium text-foreground">
                    Destination Country *
                  </Label>
                  <Select value={formData.destination} onValueChange={(value) => handleChange("destination", value)}>
                    <SelectTrigger className={`mt-1 ${errors.destination ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50 max-h-[300px]">
                      {ASIAN_COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.destination && <p className="text-xs text-destructive mt-1">{errors.destination}</p>}
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
                    className={`mt-1 ${errors.buyerName ? 'border-destructive' : ''}`}
                  />
                  {errors.buyerName && <p className="text-xs text-destructive mt-1">{errors.buyerName}</p>}
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
                    className={`mt-1 ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone / WhatsApp *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                    className={`mt-1 ${errors.phone ? 'border-destructive' : ''}`}
                  />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
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
                  {isSubmitting ? "Submitting..." : "Request a Quote"}
                </Button>
              </div>

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
