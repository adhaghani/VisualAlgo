"use client"

import { motion } from "framer-motion"

import type { AvlSnapshotStep, SerializedAvlNode } from "@/lib/avl/types"

type PositionedNode = {
  id: number
  value: number
  x: number
  y: number
  balance: number
  height: number
  leftId?: number
  rightId?: number
}

type TreeViewProps = {
  step: AvlSnapshotStep | null
}

const LEVEL_HEIGHT = 120
const NODE_RADIUS = 26
const H_PADDING = 72
const TREE_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
} as const

export function TreeView({ step }: TreeViewProps) {
  const root = step?.tree ?? null
  const pathValues = new Set(step?.path ?? [])
  if (step?.focusValue !== undefined) {
    pathValues.add(step.focusValue)
  }

  const { nodes, width, height } = layoutTree(root)

  const nodeById = new Map(nodes.map((node) => [node.id, node]))

  return (
    <div className="rounded-2xl border bg-linear-to-b from-card to-muted/20 p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">AVL Tree View</h2>
        <div className="rounded-full border bg-background px-2 py-1 text-[11px] text-muted-foreground">
          Framer Motion
        </div>
      </div>

      <div className="w-full overflow-auto rounded-xl border bg-background/80">
        <svg
          className="min-h-[440px] min-w-full"
          viewBox={`0 0 ${Math.max(width, 600)} ${Math.max(height, 420)}`}
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

          {nodes.flatMap((node) => {
            const edges = []

            if (node.leftId !== undefined) {
              const leftNode = nodeById.get(node.leftId)
              if (leftNode) {
                const points = getEdgePoints(
                  node.x,
                  node.y,
                  leftNode.x,
                  leftNode.y
                )
                edges.push(
                  <motion.line
                    key={`edge-${node.id}-${leftNode.id}`}
                    initial={false}
                    animate={{
                      x1: points.x1,
                      y1: points.y1,
                      x2: points.x2,
                      y2: points.y2,
                      stroke:
                        pathValues.has(node.value) &&
                        pathValues.has(leftNode.value)
                          ? "var(--primary)"
                          : "var(--border)",
                      strokeWidth: pathValues.has(leftNode.value) ? 3 : 2,
                    }}
                    strokeLinecap="round"
                    transition={TREE_TRANSITION}
                  />
                )
              }
            }

            if (node.rightId !== undefined) {
              const rightNode = nodeById.get(node.rightId)
              if (rightNode) {
                const points = getEdgePoints(
                  node.x,
                  node.y,
                  rightNode.x,
                  rightNode.y
                )
                edges.push(
                  <motion.line
                    key={`edge-${node.id}-${rightNode.id}`}
                    initial={false}
                    animate={{
                      x1: points.x1,
                      y1: points.y1,
                      x2: points.x2,
                      y2: points.y2,
                      stroke:
                        pathValues.has(node.value) &&
                        pathValues.has(rightNode.value)
                          ? "var(--primary)"
                          : "var(--border)",
                      strokeWidth: pathValues.has(rightNode.value) ? 3 : 2,
                    }}
                    strokeLinecap="round"
                    transition={TREE_TRANSITION}
                  />
                )
              }
            }

            return edges
          })}

          {nodes.map((node) => {
            const active = pathValues.has(node.value)

            return (
              <g key={node.id}>
                <motion.circle
                  initial={false}
                  animate={{
                    cx: node.x,
                    cy: node.y,
                    r: NODE_RADIUS,
                    fill: active ? "var(--primary)" : "var(--background)",
                    stroke: active ? "var(--primary)" : "var(--foreground)",
                    strokeWidth: active ? 3 : 2,
                  }}
                  filter="url(#nodeShadow)"
                  transition={TREE_TRANSITION}
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={
                    active ? "var(--primary-foreground)" : "var(--foreground)"
                  }
                  className="text-sm font-bold"
                >
                  {node.value}
                </text>
                <text
                  x={node.x}
                  y={node.y + 44}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--muted-foreground)"
                  className="text-[11px]"
                >
                  {`h:${node.height} bf:${node.balance}`}
                </text>
              </g>
            )
          })}

          {nodes.length === 0 ? (
            <text
              x="300"
              y="180"
              textAnchor="middle"
              fill="var(--muted-foreground)"
              className="text-sm font-medium"
            >
              Tree is empty. Insert values to start.
            </text>
          ) : null}
        </svg>
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

function layoutTree(root: SerializedAvlNode | null): {
  nodes: PositionedNode[]
  width: number
  height: number
} {
  if (!root) {
    return { nodes: [], width: 600, height: 420 }
  }

  const nodes: PositionedNode[] = []
  let cursor = 0
  let maxDepth = 0

  const walk = (node: SerializedAvlNode | null, depth: number): number => {
    if (!node) {
      return -1
    }

    maxDepth = Math.max(maxDepth, depth)

    const leftIndex = walk(node.left, depth + 1)

    const xIndex = cursor++
    const x = H_PADDING + xIndex * 96
    const y = 70 + depth * LEVEL_HEIGHT

    const record: PositionedNode = {
      id: node.id,
      value: node.value,
      x,
      y,
      balance: node.balance,
      height: node.height,
      leftId: node.left?.id,
      rightId: node.right?.id,
    }

    nodes.push(record)

    const rightIndex = walk(node.right, depth + 1)

    void leftIndex
    void rightIndex

    return xIndex
  }

  walk(root, 0)

  return {
    nodes,
    width: Math.max(600, H_PADDING * 2 + cursor * 96),
    height: Math.max(420, (maxDepth + 1) * LEVEL_HEIGHT + 120),
  }
}
