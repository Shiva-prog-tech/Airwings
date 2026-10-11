import { SiteImage } from "@/components/ui/site-image/site-image"
import { customers } from "@/content/people"

import styles from "./customers.module.scss"

/** Customer logos as a ruled strip (Parody "Digital Agency" brand row). */
export function Customers() {
  return (
    <section id="customers" className={styles.section} aria-labelledby="customers-title">
      <div className="container">
        <div className={styles.head}>
          <h2 id="customers-title" className={styles.title}>
            Supplying India&apos;s aerospace programmes
          </h2>
          <p className={styles.intro}>
            Precision components, sub-assemblies, gauges and fixtures for aerospace and engineering customers.
          </p>
        </div>
        <ul className={styles.strip} data-reveal-group>
          {customers.map((customer) => (
            <li key={customer.id} className={styles.cell}>
              <div className={styles.logo}>
                <SiteImage name={customer.logo} sizes="200px" decorative placeholder={false} />
              </div>
              <span className={styles.name}>
                {customer.name}
                {customer.division ? <span>{customer.division}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
