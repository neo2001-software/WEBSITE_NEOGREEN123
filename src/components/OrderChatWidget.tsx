import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, MessageCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface OrderChatWidgetProps {
  onUpdateForm: (field: string, value: string) => void;
  onSubmit: () => void;
  formData: {
    product: string;
    quantity: string;
    packaging: string;
    destination: string;
    incoterms: string;
    deliveryDate: string;
    buyerName: string;
    company: string;
    email: string;
    phone: string;
    notes: string;
  };
}

const OrderChatWidget = ({ onUpdateForm, onSubmit, formData }: OrderChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "👋 Hi! I'm your order assistant. Tell me what you'd like to order and I'll help fill out the form. Try: \"I need 200 kg Hot Dragon chili to Dubai, 25kg cartons, CIF\" or \"වර්ම් කොම්පෝස්ට් 50 බෑග් FOB\"",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const parseAIResponse = (aiMessage: string) => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(aiMessage);
      
      if (parsed.entities) {
        // Update form fields based on extracted entities
        if (parsed.entities.product) {
          let productValue = parsed.entities.product;
          if (parsed.entities.variety) {
            productValue += ` (${parsed.entities.variety})`;
          }
          onUpdateForm("product", productValue);
        }
        
        if (parsed.entities.quantity) {
          onUpdateForm("quantity", parsed.entities.quantity);
        }
        
        if (parsed.entities.packaging) {
          let packagingValue = parsed.entities.packaging;
          if (parsed.entities.packaging_option) {
            packagingValue = `${parsed.entities.packaging} (${parsed.entities.packaging_option})`;
          }
          onUpdateForm("packaging", packagingValue);
        }
        
        if (parsed.entities.destination_country) {
          onUpdateForm("destination", parsed.entities.destination_country);
        }
        
        if (parsed.entities.incoterms) {
          onUpdateForm("incoterms", parsed.entities.incoterms);
        }
        
        if (parsed.entities.target_date) {
          onUpdateForm("deliveryDate", parsed.entities.target_date);
        }
        
        if (parsed.entities.buyer_name) {
          onUpdateForm("buyerName", parsed.entities.buyer_name);
        }
        
        if (parsed.entities.company) {
          onUpdateForm("company", parsed.entities.company);
        }
        
        if (parsed.entities.email) {
          onUpdateForm("email", parsed.entities.email);
        }
        
        if (parsed.entities.phone) {
          onUpdateForm("phone", parsed.entities.phone);
        }

        return parsed.message || "I've updated the form with your details.";
      }
      
      return parsed.message || aiMessage;
    } catch {
      // If not JSON, return as-is
      return aiMessage;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, { role: "user", content: userMessage }],
          }),
        }
      );

      if (response.status === 429) {
        toast.error("Rate limit exceeded. Please try again in a moment.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm experiencing high traffic. Please try again in a moment or fill out the form manually.",
          },
        ]);
        return;
      }

      if (response.status === 402) {
        toast.error("Service temporarily unavailable.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm temporarily unavailable. Please fill out the form manually or contact us via WhatsApp: +94 77 511 2541",
          },
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage = parseAIResponse(data.message);
      
      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to process your message");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble right now. Please fill out the form manually or contact us via WhatsApp: +94 77 511 2541",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickChips = [
    { label: "Chili", value: "I need premium chili" },
    { label: "Worm Compost", value: "I need organic worm compost" },
    { label: "Cocopeat", value: "I need premium cocopeat" },
    { label: "Change Quantity", value: "I want to change the quantity" },
    { label: "WhatsApp", value: "I want to order via WhatsApp" },
  ];

  const handleChipClick = (value: string) => {
    setInput(value);
  };

  const generateWhatsAppLink = () => {
    const params = new URLSearchParams({
      text: `Order Request: ${formData.product || "[PRODUCT]"} - Qty: ${formData.quantity || "[___]"}, Pack: ${formData.packaging || "[___]"}, Incoterms: ${formData.incoterms || "[___]"}, Dest: ${formData.destination || "[___]"}, Date: ${formData.deliveryDate || "[___]"}, Buyer: ${formData.buyerName || "[___]"}, Company: ${formData.company || "[___]"}, Email: ${formData.email || "[___]"}, Phone: ${formData.phone || "[___]"}`,
    });
    return `https://wa.me/94775112541?${params.toString()}`;
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-gradient-nature hover:opacity-90 z-50"
        aria-label="Open order assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[90vw] sm:w-96 h-[600px] max-h-[80vh] shadow-xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-nature text-white">
        <div>
          <h3 className="font-semibold">Order Assistant</h3>
          <p className="text-xs opacity-90">Tell me what you want to order</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Quick chips */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 p-3 border-b bg-muted/30">
          {quickChips.map((chip) => (
            <Button
              key={chip.label}
              variant="outline"
              size="sm"
              onClick={() => handleChipClick(chip.value)}
              className="text-xs"
            >
              {chip.label}
            </Button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your request..."
            disabled={isLoading}
            className="flex-1"
            aria-label="Type your order request"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-nature hover:opacity-90"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Need help? <button onClick={() => window.open(generateWhatsAppLink(), "_blank")} className="underline">Talk to a human on WhatsApp</button>
        </p>
      </div>
    </Card>
  );
};

export default OrderChatWidget;
