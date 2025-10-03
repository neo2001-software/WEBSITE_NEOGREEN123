import { Leaf, Sprout, Award, Globe } from "lucide-react";

const About = () => {
  const stats = [
    {
      icon: Sprout,
      value: "Export",
      label: "Quality Chilies",
      description: "Premium Hot Dragon F1 and Scotch Bonnet varieties"
    },
    {
      icon: Leaf,
      value: "100%",
      label: "Organic Compost",
      description: "Chemical-free worm compost for soil enrichment"
    },
    {
      icon: Award,
      value: "Premium",
      label: "Cocopeat",
      description: "Renewable growing medium for modern agriculture"
    },
    {
      icon: Globe,
      value: "Sustainable",
      label: "Farming Methods",
      description: "Protected cultivation with environmental responsibility"
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
                NeoGreen
              </h2>
              <div className="w-16 h-1 bg-gradient-nature rounded-full"></div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              NeoGreen is a modern agribusiness specializing in sustainable protected cultivation and organic 
              agricultural products. We combine modern technology with eco-friendly practices to produce 
              high-quality crops and organic farming inputs for the Sri Lankan and global markets.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed">
              Based in Wenivelkola, Polgasowita, we manage advanced polytunnel greenhouses and organic compost 
              units, revolutionizing agriculture in Sri Lanka through sustainable, high-yield, and environmentally 
              responsible farming systems.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center space-x-2 bg-secondary/50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Protected Cultivation</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Export Ready</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Organic Certified</span>
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