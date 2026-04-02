"use client"

import { motion } from "framer-motion"

import type { StackStep } from "@/lib/stack/types"

type StackViewProps = {
  step: StackStep | null
}

const ELEMENT_HEIGHT = 48
const ELEMENT_GAP = 8
const ELEMENT_WIDTH = 120

export function StackView({ step }: StackViewProps) {
  const array = step?.array ?? []
  const highlightIndices = new Set(step?.highlightIndices ?? [])
  const topIndex = step?.topIndex ?? -1

  const totalHeight =
    array.length * (ELEMENT_HEIGHT + ELEMENT_GAP) + ELEMENT_GAP

  function getElementColor(index: number): string {
    if (highlightIndices.has(index)) {
      return "var(--primary)"
    }
    return "var(--muted)"
  }

  return (
    <div className="rounded-2xl border bg-linear-to-b from-card to-muted/20 p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Stack View</h2>
        <div className="rounded-full border bg-background px-2 py-1 text-[11px] text-muted-foreground">
          LIFO
        </div>
      </div>

      <div className="w-full overflow-auto rounded-xl border bg-background/80">
        <div
          className="relative flex flex-col items-center justify-end p-4"
          style={{ minHeight: "60vh", height: Math.max(totalHeight + 80, 400) }}
        >
          {array.length > 0 && (
            <div className="absolute top-4 left-4 text-xs font-medium text-muted-foreground">
              Top &rarr;
            </div>
          )}

          <div className="flex flex-col-reverse items-center">
            {array.map((value, index) => {
              const isTop = index === topIndex
              const isHighlighted = highlightIndices.has(index)

              return (
                <motion.div
                  key={`stack-${index}`}
                  initial={false}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor: getElementColor(index),
                    scale: isHighlighted ? 1.05 : 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -40,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 28,
                    mass: 0.9,
                  }}
                  className="flex items-center justify-center rounded-lg border-2 font-mono text-sm font-semibold"
                  style={{
                    width: ELEMENT_WIDTH,
                    height: ELEMENT_HEIGHT,
                    marginBottom: ELEMENT_GAP,
                    borderColor: isHighlighted
                      ? "var(--foreground)"
                      : "var(--border)",
                    color: isTop
                      ? "var(--primary-foreground)"
                      : "var(--foreground)",
                  }}
                >
                  {value}
                </motion.div>
              )
            })}
          </div>

          {array.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm font-medium text-muted-foreground">
                Stack is empty. Push elements to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[var(--primary)]" />
          <span>Top Element</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[var(--muted)]" />
          <span>Default</span>
        </div>
      </div>
    </div>
  )
}
