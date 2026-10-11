import { Icon } from "@/components/ui/icon/icon"
import { SectionHeading } from "@/components/ui/section-heading/section-heading"
import { site } from "@/content/site"

import { RfqForm } from "./rfq-form"
import styles from "./contact.module.scss"

/** Request a quote: the form, then direct contact details and the map. */
export function Contact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className="container">
        <SectionHeading
          id="contact-title"
          code="Request for quote"
          title="Send us your drawing"
          intro="Send your drawing and requirements. For urgent work, call a partner directly."
        />

        <div className={styles.layout}>
          <div className={styles.formPanel}>
            <p className={styles.panelHead} aria-hidden>
              <span>RFQ · Airwing Technologies</span>
              <span>Accepting new jobs</span>
            </p>
            <RfqForm />
          </div>

          <aside className={styles.details}>
            <address className={`${styles.card} ${styles.address}`}>
              <span className={styles.detailLabel}>
                <Icon name="pin" /> Workshop
              </span>
              <span>{site.address.street}</span>
              <span>{site.address.area}</span>
              <span>
                {site.address.city} {site.address.postalCode}, {site.address.region}
              </span>
              <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                Open in Google Maps
              </a>
            </address>

            <div className={`${styles.card} ${styles.direct}`}>
              <span className={styles.detailLabel}>
                <Icon name="phone" /> Call
              </span>
              {site.phones.map((phone) => (
                <a key={phone.href} href={phone.href} className="mono">
                  {phone.display}
                </a>
              ))}
              <span className={styles.detailLabel}>
                <Icon name="mail" /> Email
              </span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>

            <div className={styles.map}>
              <iframe
                src={site.mapEmbed}
                title="Map showing the Airwing Technologies workshop in Peenya, Bengaluru"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
