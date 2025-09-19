import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import growPelletsImage from "@/assets/grow-pellets.jpg";
import growBagsImage from "@/assets/grow-bags.jpg";
import rawMaterialImage from "@/assets/raw-material.jpg";

const ProductCategories = () => {
  const products = [
    {
      title: "Grow Pellets",
      description: "Premium coconut coir pellets that expand when watered, providing excellent drainage and aeration for optimal plant growth.",
      image: growPelletsImage,
      features: ["100% Natural", "Perfect pH Balance", "Excellent Water Retention"]
    },
    {
      title: "Grow Bags",
      description: "Durable, breathable growing bags designed for container gardening and nursery applications with superior root development.",
      image: growBagsImage,
      features: ["UV Resistant", "Optimal Drainage", "Reusable Design"]
    },
    {
      title: "Raw Material",
      description: "High-quality coconut coir raw materials sourced sustainably for various agricultural and horticultural applications.",
      image: rawMaterialImage,
      features: ["Eco-Friendly", "Consistent Quality", "Bulk Available"]
    }
  ];

  return (
    <section id="products" className="py-16 lg:py-24 bg-gradient-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Product Range
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive selection of premium growing solutions designed to support your plants at every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={product.title} className="group relative overflow-hidden bg-card border-border shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl lg:text-2xl font-bold text-foreground">
                  {product.title}
                </h3>
                <p className="text-muted-foreground text-sm lg:text-base">
                  {product.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {product.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full bg-gradient-nature hover:opacity-90 text-white group/btn"
                  size="sm"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;