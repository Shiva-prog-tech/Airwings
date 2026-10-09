import { SiteFooter } from "@/components/layout/site-footer/site-footer"
import { SiteHeader } from "@/components/layout/site-header/site-header"
import { About } from "@/components/sections/about/about"
import { Banner } from "@/components/sections/banner/banner"
import { Contact } from "@/components/sections/contact/contact"
import { Customers } from "@/components/sections/customers/customers"
import { GiantWords } from "@/components/sections/giant-words/giant-words"
import { Hero } from "@/components/sections/hero/hero"
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
 * The landing page, after Parody "Digital Agency" (Home 5) with the Full
 * Screen Slicer for projects. The header sits outside #smooth-wrapper so it
 * stays fixed while ScrollSmoother transforms the content.
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
