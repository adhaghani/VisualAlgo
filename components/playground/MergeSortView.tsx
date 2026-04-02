"use client"

import { motion } from "framer-motion"

import type { MergeSortStep } from "@/lib/mergeSort/types"

type MergeSortViewProps = {
  step: MergeSortStep | null
}

const BAR_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
} as const

const MAX_BAR_HEIGHT = 280
const BAR_WIDTH = 32
const BAR_GAP = 4

export function MergeSortView({ step }: MergeSortViewProps) {
  const array = step?.array ?? []
  const highlightIndices = new Set(step?.highlightIndices ?? [])
  const sortedIndices = step?.sortedIndices ?? new Set<number>()

  const maxVal = Math.max(...array, 1)
  const totalWidth = array.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP

  function getBarColor(index: number): string {
    if (sortedIndices.has(index)) return "var(--success)"
    if (highlightIndices.has(index)) return "var(--primary)"
    return "var(--primary)"
  }

  return (
    <div className="rounded-2xl border bg-linear-to-b from-card to-muted/20 p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Merge Sort View</h2>
        <div className="rounded-full border bg-background px-2 py-1 text-[11px] text-muted-foreground">
          O(n log n)
        </div>
      </div>

      <div className="w-full overflow-auto rounded-xl border bg-background/80">
        <div
          className="relative flex h-[60vh] min-h-[300px] items-end justify-center p-4"
          style={{ minWidth: Math.max(totalWidth, 400) }}
        >
          {array.map((value, index) => {
            const barHeight = (value / maxVal) * MAX_BAR_HEIGHT
            const isHighlighted = highlightIndices.has(index)

            return (
              <div
                key={`bar-${index}`}
                className="flex flex-col items-center"
                style={{ width: BAR_WIDTH, marginRight: BAR_GAP }}
              >
                <span className="mb-1 text-[10px] font-medium text-muted-foreground">
                  {value}
                </span>
                <motion.div
                  initial={false}
                  animate={{
                    height: barHeight,
                    backgroundColor: getBarColor(index),
                    scale: isHighlighted ? 1.05 : 1,
                  }}
                  transition={BAR_TRANSITION}
                  className="w-full rounded-t-md border-2"
                  style={{
                    borderColor: isHighlighted
                      ? "var(--foreground)"
                      : "transparent",
                  }}
                />
                <span className="mt-1 text-[10px] text-muted-foreground">
                  {index}
                </span>
              </div>
            )
          })}

          {array.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm font-medium text-muted-foreground">
                Generate an array to start sorting
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-primary" />
          <span>Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[var(--success)]" />
          <span>Sorted</span>
        </div>
      </div>
    </div>
  )
}
