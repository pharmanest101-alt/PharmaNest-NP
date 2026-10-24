import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://pharmanest.com.np'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  structuredData?: object
}

export default function SEO({
  title = 'PharmaNest - Premium Skincare Pharmacy | Pokhara, Nepal',
  description = "PharmaNest is Pokhara's trusted skincare pharmacy in Devi's Fall. Premium skincare products, expert consultations, and personalized care.",
  keywords = 'skincare pharmacy Pokhara, Nepal skincare, Devi\'s Fall pharmacy, skincare products Nepal, PharmaNest, premium skincare Nepal, skincare consultation Pokhara',
  image = `${SITE_URL}/logo.jpg`,
  url = SITE_URL,
  type = 'website',
  structuredData,
}: SEOProps) {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="PharmaNest" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Geo Meta */}
      <meta name="geo.region" content="NP-03" />
      <meta name="geo.placename" content="Pokhara" />
      <meta name="geo.position" content="28.2096;83.9856" />
      <meta name="ICBM" content="28.2096, 83.9856" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Pharmacy',
  name: 'PharmaNest',
  alternateName: 'PharmaNest Skincare Pharmacy',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.jpg`,
  image: `${SITE_URL}/logo.jpg`,
  description: "PharmaNest is Pokhara's trusted skincare pharmacy in Devi's Fall. Premium skincare products, expert consultations, and personalized care.",
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Devi's Fall",
    addressLocality: 'Pokhara',
    addressRegion: 'Kaski',
    postalCode: '33700',
    addressCountry: 'NP',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 28.2096,
    longitude: 83.9856,
  },
  telephone: '+977-9865489647',
  email: 'pharmanest101@gmail.com',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '18:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com/pharmanest',
    'https://www.instagram.com/pharmanest',
  ],
  priceRange: '$$',
  areaServed: {
    '@type': 'City',
    name: 'Pokhara',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Skincare Products',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Cleansers',
        itemListElement: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Skincare Cleansers',
          },
        },
      },
      {
        '@type': 'OfferCatalog',
        name: 'Moisturizers',
        itemListElement: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Skincare Moisturizers',
          },
        },
      },
      {
        '@type': 'OfferCatalog',
        name: 'Serums',
        itemListElement: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Skincare Serums',
          },
        },
      },
      {
        '@type': 'OfferCatalog',
        name: 'Sunscreens',
        itemListElement: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Skincare Sunscreens',
          },
        },
      },
    ],
  },
}
