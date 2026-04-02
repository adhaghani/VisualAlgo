"use client"

import { motion } from "framer-motion"

import type { DijkstraSnapshotStep } from "@/lib/dijkstra/types"

type DijkstraViewProps = {
  step: DijkstraSnapshotStep | null
}

const NODE_RADIUS = 28
const GRAPH_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
} as const

export function DijkstraView({ step }: DijkstraViewProps) {
  const nodes = step?.nodes ?? []
  const edges = step?.edges ?? []
  const visitedNodes = step?.visitedNodes ?? new Set<number>()
  const pathNodes = step?.pathNodes ?? new Set<number>()
  const activeNode = step?.activeNode
  const distances = step?.distances ?? new Map<number, number>()

  const nodeById = new Map(nodes.map((node) => [node.id, node]))

  function getNodeFill(nodeId: number): string {
    if (pathNodes.has(nodeId)) return "var(--success)"
    if (activeNode === nodeId) return "var(--primary)"
    if (visitedNodes.has(nodeId)) return "var(--primary)/0.3"
    return "var(--background)"
  }

  function getNodeStroke(nodeId: number): string {
    if (pathNodes.has(nodeId)) return "var(--success)"
    if (activeNode === nodeId) return "var(--primary)"
    if (visitedNodes.has(nodeId)) return "var(--primary)"
    return "var(--foreground)"
  }

  function getEdgeStroke(fromId: number, toId: number): string {
    if (pathNodes.has(fromId) && pathNodes.has(toId)) return "var(--success)"
    if (
      activeNode !== undefined &&
      (fromId === activeNode || toId === activeNode)
    ) {
      return "var(--primary)"
    }
    return "var(--border)"
  }

  function getEdgeWidth(fromId: number, toId: number): number {
    if (pathNodes.has(fromId) && pathNodes.has(toId)) return 4
    if (
      activeNode !== undefined &&
      (fromId === activeNode || toId === activeNode)
    ) {
      return 3
    }
    return 2
  }

  function formatDistance(dist: number): string {
    if (dist === Infinity) return "∞"
    return String(dist)
  }

  return (
    <div className="rounded-2xl border bg-linear-to-b from-card to-muted/20 p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Dijkstra View</h2>
        <div className="rounded-full border bg-background px-2 py-1 text-[11px] text-muted-foreground">
          Shortest Path
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
              id="dijkstraShadow"
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

          {edges.map(([fromId, toId, weight]) => {
            const fromNode = nodeById.get(fromId)
            const toNode = nodeById.get(toId)
            if (!fromNode || !toNode) return null

            const points = getEdgePoints(
              fromNode.x,
              fromNode.y,
              toNode.x,
              toNode.y
            )

            const isPathEdge = pathNodes.has(fromId) && pathNodes.has(toId)

            return (
              <g key={`edge-${fromId}-${toId}`}>
                <motion.line
                  initial={false}
                  animate={{
                    x1: points.x1,
                    y1: points.y1,
                    x2: points.x2,
                    y2: points.y2,
                    stroke: getEdgeStroke(fromId, toId),
                    strokeWidth: getEdgeWidth(fromId, toId),
                  }}
                  strokeLinecap="round"
                  transition={GRAPH_TRANSITION}
                />
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 8}
                  textAnchor="middle"
                  fill={
                    isPathEdge ? "var(--success)" : "var(--muted-foreground)"
                  }
                  className="text-[10px] font-medium"
                >
                  {weight}
                </text>
              </g>
            )
          })}

          {nodes.map((node) => {
            const isVisited = visitedNodes.has(node.id)
            const isPath = pathNodes.has(node.id)
            const isActive = activeNode === node.id
            const dist = distances.get(node.id)

            return (
              <g key={node.id}>
                <motion.circle
                  initial={false}
                  animate={{
                    cx: node.x,
                    cy: node.y,
                    r: NODE_RADIUS,
                    fill: getNodeFill(node.id),
                    stroke: getNodeStroke(node.id),
                    strokeWidth: isActive || isPath ? 3 : 2,
                  }}
                  filter="url(#dijkstraShadow)"
                  transition={GRAPH_TRANSITION}
                />
                <text
                  x={node.x}
                  y={node.y - 4}
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
                {dist !== undefined && (
                  <text
                    x={node.x}
                    y={node.y + 12}
                    textAnchor="middle"
                    fill={
                      isPath
                        ? "var(--success)"
                        : isActive
                          ? "var(--primary-foreground)"
                          : "var(--muted-foreground)"
                    }
                    className="text-[9px] font-medium"
                  >
                    {formatDistance(dist)}
                  </text>
                )}
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
              Graph is empty. Adjust node count to start.
            </text>
          ) : null}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full border-2 border-primary/50 bg-primary/30" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full border-2 border-[var(--success)] bg-[var(--success)]" />
          <span>Shortest Path</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-border" />
          <span>Edge weight</span>
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
