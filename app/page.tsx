import Link from "next/link"
import type { Metadata } from "next"
import {
  GitBranch,
  ArrowUpDown,
  ArrowUpAZ,
  ListOrdered,
  SquareStack,
  ArrowRightLeft,
  ArrowRight,
  Network,
  Link2,
  Merge,
  Scissors,
  Route,
  Hash,
} from "lucide-react"

import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  buildPageMetadata,
} from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} | Interactive Data Structure and Algorithm Visualizer`,
  description: SITE_DESCRIPTION,
  path: "/",
})

const dataStructures = [
  {
    href: "/playground/avl",
    label: "AVL Tree",
    icon: GitBranch,
    description: "Self-balancing binary search tree with rotation animations",
    badge: "Tree",
  },
  {
    href: "/playground/graph",
    label: "Graph Traversal",
    icon: Network,
    description: "BFS and DFS traversals with animated node exploration",
    badge: "Graph",
  },
  {
    href: "/playground/dijkstra",
    label: "Dijkstra's Algorithm",
    icon: Route,
    description: "Shortest path in weighted graphs with distance relaxation",
    badge: "Graph",
  },
  {
    href: "/playground/hash-table",
    label: "Hash Table",
    icon: Hash,
    description: "Key-value store with chaining collision resolution",
    badge: "Hash",
  },
  {
    href: "/playground/linked-list",
    label: "Linked List",
    icon: Link2,
    description:
      "Singly linked list with insert, delete, and search operations",
    badge: "Linear",
  },
  {
    href: "/playground/merge-sort",
    label: "Merge Sort",
    icon: Merge,
    description: "Divide and conquer sorting with merge animations",
    badge: "Sort",
  },
  {
    href: "/playground/quick-sort",
    label: "Quick Sort",
    icon: Scissors,
    description: "Partition-based sorting with pivot visualization",
    badge: "Sort",
  },
  {
    href: "/playground/bubble-sort",
    label: "Bubble Sort",
    icon: ArrowUpDown,
    description: "Simple comparison-based sorting with swap animations",
    badge: "Sort",
  },
  {
    href: "/playground/insertion-sort",
    label: "Insertion Sort",
    icon: ArrowUpAZ,
    description: "Build sorted array one element at a time",
    badge: "Sort",
  },
  {
    href: "/playground/array-list",
    label: "ArrayList",
    icon: ListOrdered,
    description: "Dynamic array with push, pop, insert, and remove operations",
    badge: "Array",
  },
  {
    href: "/playground/queue",
    label: "Queue",
    icon: ArrowRightLeft,
    description: "FIFO data structure with enqueue and dequeue animations",
    badge: "Linear",
  },
  {
    href: "/playground/stack",
    label: "Stack",
    icon: SquareStack,
    description: "LIFO data structure with push and pop animations",
    badge: "Linear",
  },
]

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
      },
    ],
  }

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">VisualAlgo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Interactive data structure visualizations with step-by-step
            animations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dataStructures.map(
            ({ href, label, icon: Icon, description, badge }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="rounded-full border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {badge}
                  </span>
                </div>
                <h2 className="mt-3 text-sm font-semibold">{label}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            )
          )}
        </div>

        <div className="mt-8 rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
          Press{" "}
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
            d
          </kbd>{" "}
          to toggle dark mode
        </div>
      </div>
    </div>
  )
}
