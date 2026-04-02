import {
  type DijkstraPhase,
  type DijkstraSnapshotStep,
  type SerializedDijkstraNode,
} from "@/lib/dijkstra/types"

class DijkstraNode {
  id: number
  label: string
  x: number
  y: number
  neighbors: Map<number, number>

  constructor(id: number, label: string, x: number, y: number) {
    this.id = id
    this.label = label
    this.x = x
    this.y = y
    this.neighbors = new Map()
  }
}

type SnapshotContext = {
  snapshots: DijkstraSnapshotStep[]
  nodes: Map<number, DijkstraNode>
  edges: [number, number, number][]
  visitedNodes: Set<number>
  distances: Map<number, number>
  pathNodes: Set<number>
  activeNode?: number
}

export class Dijkstra {
  private nodes: Map<number, DijkstraNode> = new Map()
  private nextNodeId = 1
  private nextSnapshotIndex = 0
  private edgeSet: Set<string> = new Set()

  constructor(nodeCount: number = 7) {
    this.createGraph(nodeCount)
  }

  run(startId?: number, endId?: number): DijkstraSnapshotStep[] {
    const context = this.createContext()
    const startNode = startId ? this.nodes.get(startId) : this.getFirstNode()

    if (!startNode) {
      this.capture(context, "complete", {
        message: "Graph is empty. Add nodes to start.",
        aiExplanation: "No nodes available for shortest path computation.",
      })
      return context.snapshots
    }

    const endNode = endId ? this.nodes.get(endId) : null
    const targetLabel = endNode ? endNode.label : "all nodes"

    this.capture(context, "start", {
      activeNode: startNode.id,
      distances: new Map([[startNode.id, 0]]),
      message: `Starting Dijkstra from node ${startNode.label} to ${targetLabel}.`,
      aiExplanation: `Initialize distances: ${startNode.label}=0, all others=∞. Using a priority queue to always visit the closest unvisited node.`,
    })

    const distances = new Map<number, number>()
    const previous = new Map<number, number | undefined>()
    const unvisited = new Set<number>()

    for (const node of this.nodes.values()) {
      distances.set(node.id, node.id === startNode.id ? 0 : Infinity)
      previous.set(node.id, undefined)
      unvisited.add(node.id)
    }

    while (unvisited.size > 0) {
      let currentId: number | null = null
      let minDist = Infinity

      for (const id of unvisited) {
        const dist = distances.get(id) ?? Infinity
        if (dist < minDist) {
          minDist = dist
          currentId = id
        }
      }

      if (currentId === null) break

      const current = this.nodes.get(currentId)
      if (!current) break

      if (endNode && currentId === endNode.id) {
        this.capture(context, "visit", {
          activeNode: currentId,
          visitedNodes: new Set(context.visitedNodes).add(currentId),
          distances: new Map(distances),
          message: `Reached target node ${current.label} with distance ${minDist}.`,
          aiExplanation: `Target node ${current.label} reached! Shortest path distance is ${minDist}.`,
        })

        const path = this.reconstructPath(previous, startNode.id, endNode.id)
        for (const id of path) {
          context.pathNodes.add(id)
        }

        this.capture(context, "complete", {
          activeNode: currentId,
          visitedNodes: new Set(context.visitedNodes).add(currentId),
          distances: new Map(distances),
          pathNodes: new Set(context.pathNodes),
          message: `Shortest path from ${startNode.label} to ${endNode.label}: ${path.map((id) => this.nodes.get(id)?.label).join(" → ")} (distance: ${minDist})`,
          aiExplanation: `The shortest path has been found by backtracking through previous pointers.`,
        })
        return context.snapshots
      }

      context.visitedNodes.add(currentId)
      unvisited.delete(currentId)

      this.capture(context, "visit", {
        activeNode: currentId,
        visitedNodes: new Set(context.visitedNodes),
        distances: new Map(distances),
        message: `Visit node ${current.label} (distance: ${minDist === Infinity ? "∞" : minDist}).`,
        aiExplanation: `Select the unvisited node with smallest known distance. Mark ${current.label} as visited.`,
      })

      for (const [neighborId, weight] of current.neighbors) {
        if (!unvisited.has(neighborId)) continue

        const neighbor = this.nodes.get(neighborId)
        if (!neighbor) continue

        const newDist = (distances.get(currentId) ?? Infinity) + weight
        const oldDist = distances.get(neighborId) ?? Infinity

        if (newDist < oldDist) {
          distances.set(neighborId, newDist)
          previous.set(neighborId, currentId)

          this.capture(context, "relax", {
            activeNode: currentId,
            visitedNodes: new Set(context.visitedNodes),
            distances: new Map(distances),
            message: `Relax edge ${current.label} → ${neighbor.label}: new distance ${newDist} (was ${oldDist === Infinity ? "∞" : oldDist}).`,
            aiExplanation: `Found a shorter path to ${neighbor.label} through ${current.label}. Update distance from ${oldDist === Infinity ? "∞" : oldDist} to ${newDist}.`,
          })

          this.capture(context, "update", {
            activeNode: neighborId,
            visitedNodes: new Set(context.visitedNodes),
            distances: new Map(distances),
            message: `Updated distance to ${neighbor.label}: ${newDist}.`,
            aiExplanation: `Distance to ${neighbor.label} updated. This node will be considered in future iterations.`,
          })
        } else {
          this.capture(context, "skip", {
            activeNode: currentId,
            visitedNodes: new Set(context.visitedNodes),
            distances: new Map(distances),
            message: `Skip edge ${current.label} → ${neighbor.label}: no improvement (${newDist} >= ${oldDist === Infinity ? "∞" : oldDist}).`,
            aiExplanation: `The path through ${current.label} doesn't improve the distance to ${neighbor.label}. Keep the current best distance.`,
          })
        }
      }
    }

    const path = endNode
      ? this.reconstructPath(previous, startNode.id, endNode.id)
      : []
    for (const id of path) {
      context.pathNodes.add(id)
    }

    this.capture(context, "complete", {
      visitedNodes: new Set(context.visitedNodes),
      distances: new Map(distances),
      pathNodes: new Set(context.pathNodes),
      message: `Dijkstra complete. Shortest distances from ${startNode.label} computed.`,
      aiExplanation:
        "All reachable nodes have been visited. The shortest paths from the source to all other nodes have been determined.",
    })

    return context.snapshots
  }

  setNodeCount(count: number): void {
    this.nodes.clear()
    this.nextNodeId = 1
    this.nextSnapshotIndex = 0
    this.edgeSet.clear()
    this.createGraph(Math.max(count, 3))
  }

  reset(): void {
    const count = this.nodes.size
    this.nodes.clear()
    this.nextNodeId = 1
    this.nextSnapshotIndex = 0
    this.edgeSet.clear()
    this.createGraph(count)
  }

  private reconstructPath(
    previous: Map<number, number | undefined>,
    startId: number,
    endId: number
  ): number[] {
    const path: number[] = []
    let current: number | undefined = endId

    while (current !== undefined) {
      path.unshift(current)
      if (current === startId) break
      current = previous.get(current)
    }

    return path[0] === startId ? path : []
  }

  private createGraph(nodeCount: number): void {
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const centerX = 300
    const centerY = 200
    const radius = 160

    for (let i = 0; i < nodeCount; i++) {
      const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      const label = labels[i] ?? String(i + 1)
      const node = new DijkstraNode(this.nextNodeId++, label, x, y)
      this.nodes.set(node.id, node)
    }

    const nodeIds = Array.from(this.nodes.keys())

    for (let i = 0; i < nodeIds.length - 1; i++) {
      const weight = Math.floor(Math.random() * 9) + 1
      this.addEdgeInternal(nodeIds[i], nodeIds[i + 1], weight)
    }

    if (nodeIds.length > 2) {
      const weight = Math.floor(Math.random() * 9) + 1
      this.addEdgeInternal(nodeIds[nodeIds.length - 1], nodeIds[0], weight)
    }

    const extraEdges = Math.floor(nodeCount * 0.8)
    for (let i = 0; i < extraEdges; i++) {
      const fromIdx = Math.floor(Math.random() * nodeIds.length)
      let toIdx = Math.floor(Math.random() * nodeIds.length)
      if (toIdx === fromIdx) {
        toIdx = (toIdx + 1) % nodeIds.length
      }
      const fromId = nodeIds[fromIdx]
      const toId = nodeIds[toIdx]
      const edgeKey = `${Math.min(fromId, toId)}-${Math.max(fromId, toId)}`
      if (!this.edgeSet.has(edgeKey)) {
        const weight = Math.floor(Math.random() * 9) + 1
        this.addEdgeInternal(fromId, toId, weight)
      }
    }
  }

  private addEdgeInternal(fromId: number, toId: number, weight: number): void {
    const fromNode = this.nodes.get(fromId)
    const toNode = this.nodes.get(toId)
    if (!fromNode || !toNode) return

    const edgeKey = `${Math.min(fromId, toId)}-${Math.max(fromId, toId)}`
    if (this.edgeSet.has(edgeKey)) return

    this.edgeSet.add(edgeKey)
    fromNode.neighbors.set(toId, weight)
    toNode.neighbors.set(fromId, weight)
  }

  private createContext(): SnapshotContext {
    return {
      snapshots: [],
      nodes: new Map(this.nodes),
      edges: this.getEdges(),
      visitedNodes: new Set(),
      distances: new Map(),
      pathNodes: new Set(),
    }
  }

  private getEdges(): [number, number, number][] {
    const edges: [number, number, number][] = []
    const seen = new Set<string>()

    for (const node of this.nodes.values()) {
      for (const [neighborId, weight] of node.neighbors) {
        const key = [
          Math.min(node.id, neighborId),
          Math.max(node.id, neighborId),
        ].join("-")
        if (!seen.has(key)) {
          seen.add(key)
          edges.push([node.id, neighborId, weight])
        }
      }
    }

    return edges
  }

  private getFirstNode(): DijkstraNode | undefined {
    return this.nodes.values().next().value
  }

  private capture(
    context: SnapshotContext,
    phase: DijkstraPhase,
    options: {
      activeNode?: number
      visitedNodes?: Set<number>
      distances?: Map<number, number>
      pathNodes?: Set<number>
      message: string
      aiExplanation: string
    }
  ): void {
    context.snapshots.push({
      index: this.nextSnapshotIndex++,
      phase,
      nodes: this.serializeNodes(context.nodes),
      edges: this.getEdges(),
      activeNode: options.activeNode,
      visitedNodes: options.visitedNodes ?? new Set(context.visitedNodes),
      distances: options.distances ?? new Map(context.distances),
      pathNodes: options.pathNodes ?? new Set(context.pathNodes),
      message: options.message,
      aiExplanation: options.aiExplanation,
    })
  }

  private serializeNodes(
    nodes: Map<number, DijkstraNode>
  ): SerializedDijkstraNode[] {
    return Array.from(nodes.values()).map((node) => ({
      id: node.id,
      label: node.label,
      x: node.x,
      y: node.y,
      neighbors: Array.from(node.neighbors.entries()).map(
        ([nodeId, weight]) => ({ nodeId, weight })
      ),
    }))
  }
}
