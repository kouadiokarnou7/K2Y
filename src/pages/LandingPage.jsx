import Header from '@/components/Header';
import Hero3D from '@/components/Hero3D';
import MapSection from '@/components/MapSection';
import GallerySection from '@/components/GallerySection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

const LandingPage = () => {
  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Header />
      
      <main className="relative">
        {/* La Hero Section est en Full Screen 3D */}
        <Hero3D />
        
        {/* Les autres sections suivent */}
        <MapSection />
        
        <GallerySection />
        <AboutSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;