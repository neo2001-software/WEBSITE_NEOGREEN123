import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    {
      src: gallery1,
      alt: "Modern plant nursery greenhouse with tomato plants",
      title: "Greenhouse Facilities"
    },
    {
      src: gallery2,
      alt: "Young cucumber plants in coconut coir pellets",
      title: "Cucumber Seedlings"
    },
    {
      src: gallery3,
      alt: "Bell pepper plants in grow bags",
      title: "Bell Pepper Cultivation"
    },
    {
      src: gallery4,
      alt: "Aubergine seedlings in nursery trays",
      title: "Aubergine Plants"
    },
    {
      src: gallery5,
      alt: "Commercial plant nursery facility overview",
      title: "Nursery Overview"
    },
    {
      src: gallery6,
      alt: "Workers in modern plant nursery",
      title: "Professional Operations"
    }
  ];

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Growing Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a glimpse into our state-of-the-art facilities and the variety of plants we nurture.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg bg-card shadow-medium hover:shadow-strong transition-all duration-300 cursor-pointer hover:-translate-y-1"
              onClick={() => setSelectedImage(index)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-sm lg:text-base">
                    {image.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-12 right-0 text-white hover:text-primary z-10"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary z-10"
                onClick={prevImage}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary z-10"
                onClick={nextImage}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Image */}
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-strong"
              />

              {/* Title */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <h3 className="text-white font-semibold text-lg bg-background/50 backdrop-blur-sm rounded-lg px-4 py-2">
                  {images[selectedImage].title}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageGallery;