"use client"

import { AnimatePresence, motion } from "framer-motion"

import type { QueueStep } from "@/lib/queue/types"

type QueueViewProps = {
  step: QueueStep | null
}

const ITEM_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
} as const

export function QueueView({ step }: QueueViewProps) {
  const array = step?.array ?? []
  const highlightIndices = new Set(step?.highlightIndices ?? [])
  const phase = step?.phase ?? "start"
  const frontIndex = step?.frontIndex ?? -1
  const rearIndex = step?.rearIndex ?? -1

  function getItemColor(index: number): string {
    if (highlightIndices.has(index)) {
      if (index === frontIndex && array.length > 1) {
        return "var(--primary)"
      }
      if (index === rearIndex && array.length > 1) {
        return "var(--warning)"
      }
      return "var(--warning)"
    }
    if (index === frontIndex && array.length > 0) {
      return "var(--primary)"
    }
    if (index === rearIndex && array.length > 0) {
      return "var(--warning)"
    }
    return "var(--muted-foreground)"
  }

  return (
    <div className="rounded-2xl border bg-linear-to-b from-card to-muted/20 p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Queue View</h2>
        <div className="rounded-full border bg-background px-2 py-1 text-[11px] text-muted-foreground">
          FIFO
        </div>
      </div>

      <div className="w-full overflow-auto rounded-xl border bg-background/80">
        <div className="relative flex h-[60vh] min-h-[300px] items-center justify-center p-6">
          {array.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary">
                  Front →
                </span>
              </div>

              <div className="flex items-center gap-2">
                <AnimatePresence mode="popLayout">
                  {array.map((value, index) => {
                    const isHighlighted = highlightIndices.has(index)
                    const isFront = index === frontIndex
                    const isRear = index === rearIndex

                    return (
                      <motion.div
                        key={`item-${index}-${value}`}
                        initial={{ opacity: 0, x: 60, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -60, scale: 0.8 }}
                        transition={ITEM_TRANSITION}
                        className="flex flex-col items-center"
                      >
                        <motion.div
                          className="flex h-16 w-16 items-center justify-center rounded-lg border-2 text-lg font-bold"
                          style={{
                            backgroundColor: getItemColor(index),
                            borderColor: isHighlighted
                              ? "var(--foreground)"
                              : "transparent",
                            color:
                              isHighlighted || isFront || isRear
                                ? "var(--background)"
                                : "var(--foreground)",
                          }}
                          animate={{
                            scale: isHighlighted ? 1.08 : 1,
                          }}
                          transition={ITEM_TRANSITION}
                        >
                          {value}
                        </motion.div>
                        <span className="mt-1 text-[10px] text-muted-foreground">
                          [{index}]
                        </span>
                        {isFront && (
                          <span className="mt-0.5 text-[10px] font-semibold text-primary">
                            F
                          </span>
                        )}
                        {isRear && (
                          <span className="mt-0.5 text-[10px] font-semibold text-[var(--warning)]">
                            R
                          </span>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--warning)]">
                  ← Rear
                </span>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm font-medium text-muted-foreground">
                {phase === "empty"
                  ? "Queue is empty - cannot perform operation"
                  : "Queue is empty - enqueue a value to start"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-primary" />
          <span>Front</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[var(--warning)]" />
          <span>Rear</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[var(--muted-foreground)]" />
          <span>Default</span>
        </div>
      </div>
    </div>
  )
}
