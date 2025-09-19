import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import About from "@/components/About";
import ImageGallery from "@/components/ImageGallery";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ProductCategories />
        <About />
        <ImageGallery />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
