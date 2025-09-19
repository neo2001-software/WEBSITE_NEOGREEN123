import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-plants.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Young plants growing in coco grow pellets"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-3xl">
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Plant's Foundation for{" "}
                <span className="bg-gradient-nature bg-clip-text text-transparent">
                  Steady Growth
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Neo Green provides premium quality grow pellets, grow bags, 
                and raw materials to nurture healthy plants from seed to harvest.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-nature hover:opacity-90 text-white shadow-medium group"
              >
                Explore Products
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-secondary/50"
              >
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="text-center sm:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-primary">10M+</div>
                <div className="text-sm text-muted-foreground">Plants Per Year</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-primary">Premium</div>
                <div className="text-sm text-muted-foreground">Quality Seeds</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-primary">Expert</div>
                <div className="text-sm text-muted-foreground">Growing Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-8 bg-gradient-nature rounded-full opacity-60"></div>
      </div>
    </section>
  );
};

export default Hero;