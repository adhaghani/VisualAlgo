import type { Metadata } from "next"
import Link from "next/link"

import { MergeSortPlaygroundClient } from "@/components/playground/pages/MergeSortPlaygroundClient"
import { algorithmSeoMap, buildPageMetadata, SITE_URL } from "@/lib/seo"

const pageData = algorithmSeoMap["merge-sort"]

export const metadata: Metadata = buildPageMetadata({
  title: `${pageData.title} Visualizer`,
  description: pageData.shortDescription,
  path: "/playground/merge-sort",
})

export default function MergeSortPlaygroundPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Merge Sort Playground",
        item: `${SITE_URL}/playground/merge-sort`,
      },
    ],
  }

  const algorithmSchema = {
    "@context": "https://schema.org",
    "@type": "Algorithm",
    name: pageData.title,
    description: pageData.fullDescription,
    algorithmType: "Sorting",
    runtime: [
      `Best case: ${pageData.complexity.best}`,
      `Average case: ${pageData.complexity.average}`,
      `Worst case: ${pageData.complexity.worst}`,
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pageData.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <main className="min-h-svh bg-linear-to-b from-background to-muted/20 p-4 md:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(algorithmSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto flex w-full max-w-400 flex-col gap-4">
        <MergeSortPlaygroundClient />

        <section
          className="rounded-xl border bg-card p-5 shadow-sm"
          aria-labelledby="merge-sort-basics"
        >
          <h2 id="merge-sort-basics" className="text-lg font-semibold">
            Merge Sort in Plain Language
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {pageData.fullDescription}
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border bg-background p-4">
              <h3 className="text-sm font-semibold">Complexity</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Best: {pageData.complexity.best}</li>
                <li>Average: {pageData.complexity.average}</li>
                <li>Worst: {pageData.complexity.worst}</li>
                <li>Space: {pageData.complexity.space}</li>
              </ul>
            </article>

            <article className="rounded-lg border bg-background p-4">
              <h3 className="text-sm font-semibold">How It Works</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {pageData.keyConcepts.map((concept) => (
                  <li key={concept}>{concept}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section
          className="rounded-xl border bg-card p-5 shadow-sm"
          aria-labelledby="merge-sort-faq"
        >
          <h2 id="merge-sort-faq" className="text-lg font-semibold">
            Merge Sort FAQ
          </h2>
          <div className="mt-3 space-y-3">
            {pageData.faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-lg border bg-background p-4"
              >
                <h3 className="text-sm font-semibold">{faq.question}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="rounded-xl border bg-card p-5 shadow-sm"
          aria-labelledby="related-sorts"
        >
          <h2 id="related-sorts" className="text-lg font-semibold">
            Related Sorting Playgrounds
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {pageData.related.map((slug) => (
              <Link
                key={slug}
                href={`/playground/${slug}`}
                className="rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {slug.replace("-", " ")}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
