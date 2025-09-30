import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import About from "@/components/About";
import Sustainability from "@/components/Sustainability";
import ImageGallery from "@/components/ImageGallery";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ProductCategories />
        <About />
        <Sustainability />
        <ImageGallery />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
