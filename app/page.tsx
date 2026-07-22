import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Statistics from "@/components/Statistics";
import Universities from "@/components/Universities";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#f7f8fb] text-[#04153f]"
    >
      <Header />

      <Hero />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-[-160px] top-[15%] h-[420px] w-[420px] rounded-full bg-[#c58a08]/5 blur-3xl" />

          <div className="absolute left-[-180px] top-[48%] h-[500px] w-[500px] rounded-full bg-[#09245e]/5 blur-3xl" />
        </div>

        <Services />

        <WhyUs />

        <Statistics />

        <Universities />

        <Gallery />

        <Contact />
      </main>

      <Footer />
    </div>
  );
}