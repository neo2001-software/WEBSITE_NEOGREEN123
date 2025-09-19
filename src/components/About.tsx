import { Leaf, Sprout, Award, Globe } from "lucide-react";

const About = () => {
  const stats = [
    {
      icon: Sprout,
      value: "10M+",
      label: "Plants Per Year",
      description: "Capacity to grow millions of healthy plants annually"
    },
    {
      icon: Leaf,
      value: "5+",
      label: "Plant Varieties",
      description: "Tomatoes, Cucumber, Bell Pepper, Aubergine & more"
    },
    {
      icon: Award,
      value: "Premium",
      label: "Quality Seeds",
      description: "Best quality seeds to meet customer requirements"
    },
    {
      icon: Globe,
      value: "Sustainable",
      label: "Growing Practices",
      description: "Eco-friendly coconut coir-based growing solutions"
    }
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Neo Green
              </h2>
              <div className="w-16 h-1 bg-gradient-nature rounded-full"></div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Neo Green plant nursery has a capacity to grow Ten Million plants per year 
              of various types: Tomatoes, Cucumber, Bell Pepper, Aubergine and many others. 
              These are grown from best quality seeds to meet customers' requirements.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed">
              Our commitment to sustainable agriculture drives us to use premium coconut coir-based 
              growing mediums that provide optimal conditions for plant development while maintaining 
              environmental responsibility.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center space-x-2 bg-secondary/50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Organic Growing</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Expert Care</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Quality Assured</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-nature rounded-lg shadow-soft group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm font-medium text-primary">{stat.label}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;