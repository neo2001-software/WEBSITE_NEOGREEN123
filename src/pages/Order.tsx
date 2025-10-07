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
import { openWhatsApp } from "@/lib/whatsapp";

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
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

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
      const { url, isBlocked } = openWhatsApp(whatsappMessage);
      
      if (isBlocked) {
        // Popup blocked, save URL for fallback link
        setWhatsappUrl(url);
        toast.info("Please click the WhatsApp link below to complete your order.");
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
            {whatsappUrl && (
              <div className="mb-6">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-nature hover:opacity-90 text-white px-6 py-3 rounded-md font-medium transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Open WhatsApp
                </a>
              </div>
            )}
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
