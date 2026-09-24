import { useState } from "react";
import type { Car } from "@/data/cars";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Collection } from "@/components/Collection";
import { Categories } from "@/components/Categories";
import { Featured } from "@/components/Featured";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { CarModal } from "@/components/CarModal";
import { Preloader } from "@/components/Preloader";
import { CustomCursor } from "@/components/CustomCursor";
import { Starfield } from "@/components/Starfield";

export default function App() {
  const [selected, setSelected] = useState<Car | null>(null);

  return (
    <main className="min-h-screen bg-bg text-fg">
      <Starfield />
      <Preloader />
      <CustomCursor />
      <Navbar />

      <Hero />

      <Collection onSelect={setSelected} />
      <Categories onSelect={setSelected} />
      <Featured onSelect={setSelected} />

      <Stats />
      <About />
      <Footer />

      <CarModal car={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
