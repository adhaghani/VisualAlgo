import type { Metadata } from "next"

export const SITE_NAME = "VisualAlgo"
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://visualalgo.app"
export const SITE_DESCRIPTION =
  "Learn data structures and algorithms with interactive step-by-step visualizations and plain-language explanations."

export type AlgorithmSeoEntry = {
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  complexity: {
    best: string
    average: string
    worst: string
    space: string
  }
  keyConcepts: string[]
  related: string[]
  faqs: Array<{ question: string; answer: string }>
}

export const algorithmSeoMap: Record<string, AlgorithmSeoEntry> = {
  "merge-sort": {
    slug: "merge-sort",
    title: "Merge Sort",
    shortDescription:
      "Visualize merge sort with animated divide-and-conquer steps and stable merging.",
    fullDescription:
      "Merge Sort recursively splits an array into smaller halves, sorts each half, and merges them into a fully ordered result. It is stable and guarantees predictable performance.",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)",
    },
    keyConcepts: [
      "Divide-and-conquer strategy",
      "Recursive splitting into halves",
      "Stable merging of sorted subarrays",
      "Predictable O(n log n) runtime",
    ],
    related: ["quick-sort", "insertion-sort", "bubble-sort"],
    faqs: [
      {
        question: "What is merge sort best used for?",
        answer:
          "Merge sort is great when you want predictable O(n log n) runtime and stable sorting behavior.",
      },
      {
        question: "Is merge sort stable?",
        answer:
          "Yes. Merge sort is stable because equal elements keep their relative order when merged correctly.",
      },
      {
        question: "Why does merge sort use extra memory?",
        answer:
          "During merging, temporary arrays are used to combine sorted halves, which leads to O(n) extra space.",
      },
    ],
  },
}

export const allRoutes = [
  "/",
  "/playground/array-list",
  "/playground/avl",
  "/playground/bubble-sort",
  "/playground/dijkstra",
  "/playground/graph",
  "/playground/hash-table",
  "/playground/insertion-sort",
  "/playground/linked-list",
  "/playground/merge-sort",
  "/playground/queue",
  "/playground/quick-sort",
  "/playground/stack",
]

export function buildPageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const canonical = new URL(path, SITE_URL).toString()

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: "/og/default-og.svg",
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} preview image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/default-og.svg"],
    },
  }
}
