import { SiteFooter } from "@/components/layout/site-footer/site-footer"
import { SiteHeader } from "@/components/layout/site-header/site-header"
import { About } from "@/components/sections/about/about"
import { Banner } from "@/components/sections/banner/banner"
import { Contact } from "@/components/sections/contact/contact"
import { Customers } from "@/components/sections/customers/customers"
import { GiantWords } from "@/components/sections/giant-words/giant-words"
import { Hero } from "@/components/sections/hero/hero"
import { Industries } from "@/components/sections/industries/industries"
import { Infrastructure } from "@/components/sections/infrastructure/infrastructure"
import { Machinery } from "@/components/sections/machinery/machinery"
import { Process } from "@/components/sections/process/process"
import { Projects } from "@/components/sections/projects/projects"
import { Quality } from "@/components/sections/quality/quality"
import { Services } from "@/components/sections/services/services"
import { Team } from "@/components/sections/team/team"
import { Tooling } from "@/components/sections/tooling/tooling"
import { SmoothScroll } from "@/lib/motion/smooth-scroll"

/**
 * The landing page ("Mission grade"): cinematic hero, company story,
 * capabilities, the sectors served over ignition footage, then the facility,
 * flight hardware slicer, machines, clean-room quality band, process, team
 * and the quote form. The header sits outside #smooth-wrapper so it stays
 * fixed while ScrollSmoother transforms the content.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <SmoothScroll />
          <main id="main">
            <Hero />
            <About />
            <Customers />
            <Services />
            <Industries />
            <GiantWords />
            <Infrastructure />
            <Projects />
            <Machinery />
            <Quality />
            <Process />
            <Tooling />
            <Team />
            <Contact />
            <Banner />
          </main>
          <SiteFooter />
        </div>
      </div>
    </>
  )
}
