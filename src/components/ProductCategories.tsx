import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import hotDragonImage from "@/assets/hot-dragon-chilies.jpg";
import organicCompostImage from "@/assets/organic-compost.jpg";
import cocopeatImage from "@/assets/cocopeat-product.jpg";

const ProductCategories = () => {
  const products = [
    {
      title: "Premium Chili Varieties",
      description: "Export-quality Hot Dragon F1 and Scotch Bonnet chilies with year-round production, pest resistance, and uniform quality for global markets.",
      image: hotDragonImage,
      features: ["Export Quality", "Year-Round Production", "High Heat & Yield"]
    },
    {
      title: "Organic Worm Compost",
      description: "100% organic and chemical-free compost that enriches soil fertility, boosts plant growth, and available in retail and bulk packs.",
      image: organicCompostImage,
      features: ["Chemical-Free", "Soil Enrichment", "Bulk Available"]
    },
    {
      title: "Premium Cocopeat",
      description: "Organic, renewable, and biodegradable growing medium with excellent water retention, ideal for hydroponics and potted plants.",
      image: cocopeatImage,
      features: ["Water Retention", "Renewable", "Hydroponics Ready"]
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