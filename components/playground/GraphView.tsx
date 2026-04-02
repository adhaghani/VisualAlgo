"use client"

import { motion } from "framer-motion"

import type { GraphSnapshotStep } from "@/lib/graph/types"

type GraphViewProps = {
  step: GraphSnapshotStep | null
}

const NODE_RADIUS = 28
const GRAPH_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
} as const

export function GraphView({ step }: GraphViewProps) {
  const nodes = step?.nodes ?? []
  const edges = step?.edges ?? []
  const visitedNodes = step?.visitedNodes ?? new Set<number>()
  const frontierNodes = step?.frontierNodes ?? new Set<number>()
  const activeNode = step?.activeNode

  const nodeById = new Map(nodes.map((node) => [node.id, node]))

  return (
    <div className="rounded-2xl border bg-linear-to-b from-card to-muted/20 p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Graph View</h2>
        <div className="rounded-full border bg-background px-2 py-1 text-[11px] text-muted-foreground">
          Framer Motion
        </div>
      </div>

      <div className="w-full overflow-auto rounded-xl border bg-background/80">
        <svg
          className="h-[60vh] min-h-[400px] w-full"
          viewBox="0 0 600 460"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter
              id="nodeShadow"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2.5"
                floodColor="var(--foreground)"
                floodOpacity="0.2"
              />
            </filter>
          </defs>

          {edges.map(([fromId, toId]) => {
            const fromNode = nodeById.get(fromId)
            const toNode = nodeById.get(toId)
            if (!fromNode || !toNode) return null

            const points = getEdgePoints(
              fromNode.x,
              fromNode.y,
              toNode.x,
              toNode.y
            )

            const isEdgeActive =
              activeNode !== undefined &&
              (fromId === activeNode || toId === activeNode) &&
              visitedNodes.has(fromId) &&
              visitedNodes.has(toId)

            return (
              <motion.line
                key={`edge-${fromId}-${toId}`}
                initial={false}
                animate={{
                  x1: points.x1,
                  y1: points.y1,
                  x2: points.x2,
                  y2: points.y2,
                  stroke: isEdgeActive ? "var(--primary)" : "var(--border)",
                  strokeWidth: isEdgeActive ? 3 : 2,
                }}
                strokeLinecap="round"
                transition={GRAPH_TRANSITION}
              />
            )
          })}

          {nodes.map((node) => {
            const isVisited = visitedNodes.has(node.id)
            const isFrontier = frontierNodes.has(node.id)
            const isActive = activeNode === node.id

            return (
              <g key={node.id}>
                <motion.circle
                  initial={false}
                  animate={{
                    cx: node.x,
                    cy: node.y,
                    r: NODE_RADIUS,
                    fill: isActive
                      ? "var(--primary)"
                      : isVisited
                        ? "var(--primary)/0.3"
                        : "var(--background)",
                    stroke: isActive
                      ? "var(--primary)"
                      : isFrontier
                        ? "var(--ring)"
                        : isVisited
                          ? "var(--primary)"
                          : "var(--foreground)",
                    strokeWidth: isActive || isFrontier ? 3 : 2,
                  }}
                  filter="url(#nodeShadow)"
                  transition={GRAPH_TRANSITION}
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={
                    isActive || isVisited
                      ? "var(--primary-foreground)"
                      : "var(--foreground)"
                  }
                  className="text-sm font-bold"
                >
                  {node.label}
                </text>
              </g>
            )
          })}

          {nodes.length === 0 ? (
            <text
              x="300"
              y="230"
              textAnchor="middle"
              fill="var(--muted-foreground)"
              className="text-sm font-medium"
            >
              Graph is empty. Add nodes to start.
            </text>
          ) : null}
        </svg>
      </div>

      <div className="mt-3 flex gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full border-2 border-primary/50 bg-primary/30" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full border-2 border-ring bg-background" />
          <span>Frontier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary" />
          <span>Active</span>
        </div>
      </div>
    </div>
  )
}

function getEdgePoints(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1
  const dy = y2 - y1
  const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
  const offsetX = (dx / distance) * NODE_RADIUS
  const offsetY = (dy / distance) * NODE_RADIUS

  return {
    x1: x1 + offsetX,
    y1: y1 + offsetY,
    x2: x2 - offsetX,
    y2: y2 - offsetY,
  }
}
