export function websiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Poppy Flowers Help Center',
    url: siteUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Poppy Flowers',
      url: 'https://poppyflowers.com',
    },
  };
}

export function faqPageJsonLd(
  items: { question: string; answer: string }[],
  url: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    url,
  };
}

export function howToJsonLd(
  title: string,
  description: string,
  steps: { title: string; description: string }[],
  url: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
    url,
  };
}

export function productJsonLd(
  name: string,
  description: string,
  priceRange?: { min: number; max: number; unit: string },
  url?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Organization',
      name: 'Poppy Flowers',
    },
    ...(priceRange && {
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: priceRange.min,
        highPrice: priceRange.max,
        priceCurrency: 'USD',
        unitText: priceRange.unit,
      },
    }),
    ...(url && { url }),
  };
}

export function localBusinessJsonLd(
  name: string,
  location: string,
  description: string,
  url?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location,
    },
    ...(url && { url }),
  };
}

export function articleJsonLd(
  title: string,
  description: string,
  author: string,
  publishedDate: Date,
  url: string,
  updatedDate?: Date,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Poppy Flowers',
      url: 'https://poppyflowers.com',
    },
    datePublished: publishedDate.toISOString(),
    ...(updatedDate && { dateModified: updatedDate.toISOString() }),
    url,
  };
}
