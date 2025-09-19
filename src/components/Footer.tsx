import { Leaf, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-nature rounded-lg shadow-soft">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-background">
                  Neo Green
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

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-background">Quick Links</h4>
            <div className="space-y-3">
              {[
                { name: "Home", href: "#home" },
                { name: "About Us", href: "#about" },
                { name: "Products", href: "#products" },
                { name: "Gallery", href: "#gallery" },
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
                © 2024 Neo Green. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;