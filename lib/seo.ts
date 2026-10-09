import { site } from "@/content/site"

/** Organization + LocalBusiness (manufacturer) for search engines. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  logo: `${site.url}/images/brand/logo.webp`,
  image: `${site.url}/opengraph-image.png`,
  description: site.description,
  slogan: site.tagline,
  foundingDate: String(site.founded),
  email: site.email,
  telephone: site.phones.map((phone) => phone.display),
  taxID: site.gstin,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.street}, ${site.address.area}`,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  areaServed: "IN",
  knowsAbout: [
    "CNC machining",
    "Aerospace components",
    "Defence components",
    "Jigs and fixtures",
    "CMM inspection",
  ],
} as const
