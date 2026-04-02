"use client"

import { motion } from "framer-motion"

import type { LinkedListSnapshotStep } from "@/lib/linkedlist/types"

type LinkedListViewProps = {
  step: LinkedListSnapshotStep | null
}

const NODE_WIDTH = 120
const NODE_HEIGHT = 60
const GAP = 40
const NODE_RADIUS = 8
const LIST_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
} as const

export function LinkedListView({ step }: LinkedListViewProps) {
  const nodes = step?.nodes ?? []
  const highlightIds = new Set(step?.highlightIds ?? [])
  const activeId = step?.activeId

  const nodeById = new Map(nodes.map((node) => [node.id, node]))

  const startX = 60
  const startY = 100

  return (
    <div className="rounded-2xl border bg-linear-to-b from-card to-muted/20 p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">
          Linked List View
        </h2>
        <div className="rounded-full border bg-background px-2 py-1 text-[11px] text-muted-foreground">
          Framer Motion
        </div>
      </div>

      <div className="w-full overflow-auto rounded-xl border bg-background/80">
        <svg
          className="h-[60vh] min-h-[300px] w-full"
          viewBox={`0 0 ${Math.max(startX * 2 + nodes.length * (NODE_WIDTH + GAP), 600)} 260`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--border)" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--primary)" />
            </marker>
          </defs>

          {nodes.map((node, index) => {
            const x = startX + index * (NODE_WIDTH + GAP)
            const y = startY
            const isActive = activeId === node.id
            const isHighlight = highlightIds.has(node.id)
            const nextNode = nodeById.get(node.nextId ?? -1)
            const nextIndex =
              nextNode !== undefined
                ? nodes.findIndex((n) => n.id === nextNode.id)
                : -1

            return (
              <g key={node.id}>
                {nextIndex >= 0 && (
                  <motion.line
                    initial={false}
                    animate={{
                      x1: x + NODE_WIDTH,
                      y1: y + NODE_HEIGHT / 2,
                      x2: startX + nextIndex * (NODE_WIDTH + GAP),
                      y2: y + NODE_HEIGHT / 2,
                    }}
                    stroke={isHighlight ? "var(--primary)" : "var(--border)"}
                    strokeWidth={isHighlight ? 2.5 : 1.5}
                    markerEnd={
                      isHighlight ? "url(#arrowhead-active)" : "url(#arrowhead)"
                    }
                    transition={LIST_TRANSITION}
                  />
                )}

                {!node.nextId && (
                  <g>
                    <motion.line
                      initial={false}
                      animate={{
                        x1: x + NODE_WIDTH,
                        y1: y + NODE_HEIGHT / 2,
                        x2: x + NODE_WIDTH + 30,
                        y2: y + NODE_HEIGHT / 2,
                      }}
                      stroke="var(--muted-foreground)"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                      transition={LIST_TRANSITION}
                    />
                    <text
                      x={x + NODE_WIDTH + 40}
                      y={y + NODE_HEIGHT / 2}
                      dominantBaseline="middle"
                      fill="var(--muted-foreground)"
                      className="text-xs"
                    >
                      null
                    </text>
                  </g>
                )}

                <motion.rect
                  initial={false}
                  animate={{
                    x,
                    y,
                    width: NODE_WIDTH,
                    height: NODE_HEIGHT,
                    rx: NODE_RADIUS,
                    fill: isActive
                      ? "var(--primary)"
                      : isHighlight
                        ? "var(--primary)/0.15"
                        : "var(--background)",
                    stroke: isActive
                      ? "var(--primary)"
                      : isHighlight
                        ? "var(--primary)"
                        : "var(--foreground)",
                    strokeWidth: isActive ? 3 : 2,
                  }}
                  transition={LIST_TRANSITION}
                />

                <text
                  x={x + NODE_WIDTH / 2}
                  y={y + NODE_HEIGHT / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={
                    isActive ? "var(--primary-foreground)" : "var(--foreground)"
                  }
                  className="text-sm font-bold"
                >
                  {node.value}
                </text>

                {index === 0 && (
                  <g>
                    <text
                      x={x - 10}
                      y={y - 12}
                      textAnchor="end"
                      fill="var(--muted-foreground)"
                      className="text-[11px] font-medium"
                    >
                      HEAD
                    </text>
                    <motion.line
                      initial={false}
                      animate={{
                        x1: x - 5,
                        y1: y - 6,
                        x2: x,
                        y2: y,
                      }}
                      stroke="var(--muted-foreground)"
                      strokeWidth={1.5}
                      markerEnd="url(#arrowhead)"
                      transition={LIST_TRANSITION}
                    />
                  </g>
                )}
              </g>
            )
          })}

          {nodes.length === 0 ? (
            <text
              x="300"
              y="130"
              textAnchor="middle"
              fill="var(--muted-foreground)"
              className="text-sm font-medium"
            >
              List is empty. Insert values to start.
            </text>
          ) : null}
        </svg>
      </div>

      <div className="mt-3 flex gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-primary" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border border-primary bg-primary/15" />
          <span>Highlighted</span>
        </div>
      </div>
    </div>
  )
}
