import { Recycle, Droplets, Shield, Target } from "lucide-react";

const Sustainability = () => {
  const practices = [
    {
      icon: Recycle,
      title: "Recycling & Waste Management",
      description: "Comprehensive organic waste management and recycling systems for sustainable operations."
    },
    {
      icon: Droplets,
      title: "Drip Irrigation & Fertigation",
      description: "Advanced water conservation through precision irrigation and nutrient delivery systems."
    },
    {
      icon: Shield,
      title: "Reduced Chemical Use",
      description: "Minimizing chemical inputs through integrated pest management and organic practices."
    },
    {
      icon: Target,
      title: "Continuous Research",
      description: "Ongoing research and development for greener farming methods and sustainable solutions."
    }
  ];

  return (
    <section id="sustainability" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Sustainability Commitment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leading the way in sustainable agriculture with innovative practices that protect our environment 
            while delivering premium quality products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {practices.map((practice, index) => (
            <div 
              key={index} 
              className="group bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-nature rounded-lg shadow-soft group-hover:scale-110 transition-transform duration-300 mx-auto mb-4">
                <practice.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {practice.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {practice.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-soft rounded-lg p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Environmental Impact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary">50%</div>
              <div className="text-sm text-muted-foreground">Reduced Water Usage</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary">75%</div>
              <div className="text-sm text-muted-foreground">Less Chemical Inputs</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Renewable Resources</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sustainability;