"use client"

import { motion } from "framer-motion"

import type { ArrayListStep } from "@/lib/arrayList/types"

type ArrayListViewProps = {
  step: ArrayListStep | null
}

const CELL_WIDTH = 56
const CELL_HEIGHT = 56
const CELL_GAP = 4
const CELL_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
} as const

export function ArrayListView({ step }: ArrayListViewProps) {
  const array = step?.array ?? []
  const highlightIndices = new Set(step?.highlightIndices ?? [])
  const capacity = step?.capacity ?? 4
  const phase = step?.phase ?? "start"
  const operation = step?.operation

  const totalWidth = capacity * (CELL_WIDTH + CELL_GAP) + CELL_GAP
  const isOutOfBounds = phase === "out-of-bounds"

  function getCellColor(index: number): string {
    if (isOutOfBounds) {
      return "var(--destructive)"
    }
    if (highlightIndices.has(index)) {
      return "var(--primary)"
    }
    if (index < array.length) {
      return "var(--primary)"
    }
    return "var(--muted)"
  }

  function getCellTextColor(index: number): string {
    if (isOutOfBounds) {
      return "var(--destructive-foreground)"
    }
    if (highlightIndices.has(index)) {
      return "var(--primary-foreground)"
    }
    if (index < array.length) {
      return "var(--foreground)"
    }
    return "var(--muted-foreground)"
  }

  return (
    <div className="rounded-2xl border bg-linear-to-b from-card to-muted/20 p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">ArrayList View</h2>
        <div className="rounded-full border bg-background px-2 py-1 text-[11px] text-muted-foreground">
          Framer Motion
        </div>
      </div>

      <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span>
          Size: <strong className="text-foreground">{array.length}</strong> /{" "}
          Capacity: <strong className="text-foreground">{capacity}</strong>
        </span>
        {operation && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
            {operation}
          </span>
        )}
      </div>

      <div className="w-full overflow-auto rounded-xl border bg-background/80">
        <div
          className="relative flex h-[60vh] min-h-[300px] items-center p-6"
          style={{ minWidth: Math.max(totalWidth, 400) }}
        >
          {Array.from({ length: capacity }).map((_, index) => {
            const hasValue = index < array.length
            const value = hasValue ? array[index] : null
            const isHighlighted = highlightIndices.has(index)
            const cellColor = getCellColor(index)
            const textColor = getCellTextColor(index)

            return (
              <div
                key={`cell-${index}`}
                className="flex flex-col items-center"
                style={{ width: CELL_WIDTH, marginRight: CELL_GAP }}
              >
                <span className="mb-1 text-[10px] font-medium text-muted-foreground">
                  [{index}]
                </span>
                <motion.div
                  initial={false}
                  animate={{
                    width: CELL_WIDTH,
                    height: CELL_HEIGHT,
                    backgroundColor: cellColor,
                    scale: isHighlighted ? 1.08 : 1,
                    borderColor: isHighlighted
                      ? "var(--foreground)"
                      : "var(--border)",
                  }}
                  transition={CELL_TRANSITION}
                  className="flex items-center justify-center rounded-lg border-2"
                  layout
                >
                  {hasValue ? (
                    <motion.span
                      key={`val-${index}-${value}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm font-bold"
                      style={{ color: textColor }}
                    >
                      {value}
                    </motion.span>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">—</span>
                  )}
                </motion.div>
              </div>
            )
          })}

          {array.length === 0 && capacity === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm font-medium text-muted-foreground">
                Perform an operation to begin
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-primary" />
          <span>Filled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-muted" />
          <span>Empty capacity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm border-2 border-foreground bg-primary" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-destructive" />
          <span>Out of bounds</span>
        </div>
      </div>
    </div>
  )
}
