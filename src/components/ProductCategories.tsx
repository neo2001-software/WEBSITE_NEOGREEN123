import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import hotDragonImage from "@/assets/hot-dragon-chilies.jpg";
import organicCompostImage from "@/assets/organic-compost.jpg";
import cocopeatImage from "@/assets/cocopeat-product.jpg";

const ProductCategories = () => {
  const products = [
    {
      title: "Chili",
      displayTitle: "Premium Chili Varieties",
      description: "Export-quality Hot Dragon F1 and Scotch Bonnet chilies with year-round production, pest resistance, and uniform quality for global markets.",
      image: hotDragonImage,
      features: ["Export Quality", "Year-Round Production", "High Heat & Yield"],
      productParam: "chili"
    },
    {
      title: "Organic Worm Compost",
      displayTitle: "Organic Worm Compost",
      description: "100% organic and chemical-free compost that enriches soil fertility, boosts plant growth, and available in retail and bulk packs.",
      image: organicCompostImage,
      features: ["Chemical-Free", "Soil Enrichment", "Bulk Available"],
      productParam: "compost"
    },
    {
      title: "Premium Cocopeat",
      displayTitle: "Premium Cocopeat",
      description: "Organic, renewable, and biodegradable growing medium with excellent water retention, ideal for hydroponics and potted plants.",
      image: cocopeatImage,
      features: ["Water Retention", "Renewable", "Hydroponics Ready"],
      productParam: "cocopeat"
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
                  {product.displayTitle}
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

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-nature hover:opacity-90 text-white group/btn"
                    size="sm"
                    onClick={() => {
                      window.location.href = `/order?product=${product.productParam}`;
                    }}
                  >
                    Learn More / Order
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/5 group/whatsapp"
                    size="sm"
                    onClick={() => {
                      const whatsappText = `Hello NeoGreen! I'd like to order ${product.displayTitle}`;
                      window.open(`https://wa.me/94778829398?text=${encodeURIComponent(whatsappText)}`, '_blank');
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    Order on WhatsApp
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;