import { MapPin, Phone, Mail, Facebook, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-nature rounded-lg shadow-soft">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-background">
                  Cocopel Plant Nurseries
                </h3>
                <p className="text-sm text-background/70">
                  your plant's foundation for steady growth
                </p>
              </div>
            </div>
            <p className="text-background/80 leading-relaxed">
              Leading provider of premium coconut coir-based growing solutions, 
              supporting sustainable agriculture with expert growing support and 
              quality assured products.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-background hover:text-primary hover:bg-background/10 p-2"
                asChild
              >
                <a href="#" aria-label="Follow us on Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-background">Contact Information</h4>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-background">Head Office</p>
                  <p className="text-background/80 text-sm leading-relaxed">
                    Cocopel Lanka (Pvt) Ltd.<br />
                    No. #17, Sir John Kotelawala Mawatha,<br />
                    Ratmalana, Sri Lanka
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-background">Phone</p>
                  <div className="text-background/80 text-sm space-y-1">
                    <p>+94 11 2626230</p>
                    <p>+94 11 2624064</p>
                    <p>+94 11 2622548</p>
                    <p>+94 11 2623109</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-background">Email</p>
                  <a 
                    href="mailto:cocopel@slt.net.lk" 
                    className="text-background/80 text-sm hover:text-primary transition-colors duration-200"
                  >
                    cocopel@slt.net.lk
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-background">Quick Links</h4>
            <div className="space-y-3">
              {[
                { name: "Home", href: "#home" },
                { name: "About Us", href: "#about" },
                { name: "Products", href: "#products" },
                { name: "Gallery", href: "#gallery" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-background/80 hover:text-primary transition-colors duration-200 text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-background/20">
              <p className="text-xs text-background/60">
                © 2024 Cocopel Plant Nurseries. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;