import { Choreography } from "@/components/motion/Choreography";
import { Sculpture } from "@/components/sculpture/Sculpture";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Trail } from "@/components/Trail";
import { About } from "@/components/sections/About";
import { Certificates } from "@/components/sections/Certificates";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Foundations } from "@/components/sections/Foundations";
import { Hero } from "@/components/sections/Hero";
import { Method } from "@/components/sections/Method";

/** One continuous page in seven sections; a single ribbon travels through all of them, and a trail in the margin keeps count. */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <SmoothScroll />
      <div className="passage-veil" aria-hidden="true" />
      <Sculpture />
      <Trail />
      <Choreography />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Method />
        <Foundations />
        <Certificates />
        <Experience />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
