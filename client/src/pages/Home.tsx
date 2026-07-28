import Hero from "@/components/site/Hero";
import MenuSection from "@/components/site/MenuSection";
import GallerySection from "@/components/site/GallerySection";
import OrderSection from "@/components/site/OrderSection";
import PoliciesSection from "@/components/site/PoliciesSection";
import PickupSection from "@/components/site/PickupSection";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <MenuSection />
        <GallerySection />
        <OrderSection />
        <PoliciesSection />
        <PickupSection />
      </main>
      <Footer />
    </div>
  );
}
