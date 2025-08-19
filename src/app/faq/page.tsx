import FaqSection from "@/components/faq-section";
import Navbar from "@/components/navbar";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#F0FBFA]">
      <section className="relative w-full bg-[#0ABAB5]">
        <div className="absolute inset-0 -z-10 bg-[#0ABAB5]" />
        <Navbar isDarkBackground={true} />
        
        <div className="mx-auto max-w-[1280px] px-4 pt-16 pb-16 md:pt-24 md:pb-24">
          <div className="text-white text-center">
            <h1 className="font-poppins font-bold text-[34px] md:text-[50px] leading-[1.5] capitalize">
              Frequently Asked Questions
            </h1>
            <p className="mt-3 text-[16px] leading-[1.5] max-w-[600px] mx-auto">
              Everything You Need to Know Before You Fly
            </p>
          </div>
        </div>
      </section>
      
      <div className="w-full max-w-[1280px] mx-auto px-2 py-12">
        <FaqSection />
      </div>
    </main>
  );
}