import {
  type GraphOperation,
  type GraphPhase,
  type GraphSnapshotStep,
  type SerializedGraphNode,
} from "@/lib/graph/types"

class GraphNode {
  id: number
  label: string
  x: number
  y: number
  neighbors: Set<number>

  constructor(id: number, label: string, x: number, y: number) {
    this.id = id
    this.label = label
    this.x = x
    this.y = y
    this.neighbors = new Set()
  }
}

type SnapshotContext = {
  operation: GraphOperation
  snapshots: GraphSnapshotStep[]
  nodes: Map<number, GraphNode>
  edges: [number, number][]
  visitedNodes: Set<number>
  frontierNodes: Set<number>
  activeNode?: number
}

export class Graph {
  private nodes: Map<number, GraphNode> = new Map()
  private nextNodeId = 1
  private nextSnapshotIndex = 0
  private edgeSet: Set<string> = new Set()

  constructor() {
    this.createDefaultGraph()
  }

  bfs(startId?: number): GraphSnapshotStep[] {
    const context = this.createContext("bfs")
    const startNode = startId ? this.nodes.get(startId) : this.getFirstNode()

    if (!startNode) {
      this.capture(context, "complete", {
        message: "Graph is empty. Add nodes to start.",
        aiExplanation: "No nodes available for traversal.",
      })
      return context.snapshots
    }

    this.capture(context, "start", {
      activeNode: startNode.id,
      message: `Starting BFS from node ${startNode.label}.`,
      aiExplanation: `Breadth-First Search explores level by level using a queue. Starting from ${startNode.label}.`,
    })

    const visited = new Set<number>()
    const queue: number[] = [startNode.id]
    visited.add(startNode.id)
    context.visitedNodes.add(startNode.id)

    this.capture(context, "visit", {
      activeNode: startNode.id,
      visitedNodes: new Set(visited),
      message: `Visit node ${startNode.label}.`,
      aiExplanation: `Mark ${startNode.label} as visited and add to queue.`,
    })

    while (queue.length > 0) {
      const currentId = queue.shift()!
      const current = this.nodes.get(currentId)
      if (!current) continue

      context.frontierNodes.add(currentId)
      this.capture(context, "dequeue", {
        activeNode: currentId,
        visitedNodes: new Set(visited),
        frontierNodes: new Set(context.frontierNodes),
        message: `Dequeue node ${current.label}.`,
        aiExplanation: `Remove ${current.label} from front of queue to explore its neighbors.`,
      })

      for (const neighborId of current.neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId)
          context.visitedNodes.add(neighborId)
          queue.push(neighborId)
          context.frontierNodes.add(neighborId)

          const neighbor = this.nodes.get(neighborId)!
          this.capture(context, "enqueue", {
            activeNode: neighborId,
            visitedNodes: new Set(visited),
            frontierNodes: new Set(context.frontierNodes),
            message: `Discover and enqueue neighbor ${neighbor.label}.`,
            aiExplanation: `Found unvisited neighbor ${neighbor.label}. Mark as visited and add to queue.`,
          })
        }
      }

      context.frontierNodes.delete(currentId)
      this.capture(context, "explore", {
        activeNode: currentId,
        visitedNodes: new Set(visited),
        frontierNodes: new Set(context.frontierNodes),
        message: `Finished exploring neighbors of ${current.label}.`,
        aiExplanation: `All neighbors of ${current.label} have been processed.`,
      })
    }

    this.capture(context, "complete", {
      visitedNodes: new Set(visited),
      message: "BFS complete. All reachable nodes visited.",
      aiExplanation:
        "Queue is empty. All nodes reachable from the start have been visited in level order.",
    })

    return context.snapshots
  }

  dfs(startId?: number): GraphSnapshotStep[] {
    const context = this.createContext("dfs")
    const startNode = startId ? this.nodes.get(startId) : this.getFirstNode()

    if (!startNode) {
      this.capture(context, "complete", {
        message: "Graph is empty. Add nodes to start.",
        aiExplanation: "No nodes available for traversal.",
      })
      return context.snapshots
    }

    this.capture(context, "start", {
      activeNode: startNode.id,
      message: `Starting DFS from node ${startNode.label}.`,
      aiExplanation: `Depth-First Search explores as deep as possible using a stack. Starting from ${startNode.label}.`,
    })

    const visited = new Set<number>()
    const stack: number[] = [startNode.id]

    this.capture(context, "push", {
      activeNode: startNode.id,
      visitedNodes: new Set(visited),
      frontierNodes: new Set(stack),
      message: `Push node ${startNode.label} onto stack.`,
      aiExplanation: `Initialize DFS stack with starting node ${startNode.label}.`,
    })

    while (stack.length > 0) {
      const currentId = stack[stack.length - 1]
      const current = this.nodes.get(currentId)
      if (!current) {
        stack.pop()
        continue
      }

      if (!visited.has(currentId)) {
        visited.add(currentId)
        context.visitedNodes.add(currentId)

        this.capture(context, "visit", {
          activeNode: currentId,
          visitedNodes: new Set(visited),
          frontierNodes: new Set(stack),
          message: `Visit node ${current.label}.`,
          aiExplanation: `First time visiting ${current.label}. Mark as visited.`,
        })
      }

      let pushedNeighbor = false
      for (const neighborId of current.neighbors) {
        if (!visited.has(neighborId) && !stack.includes(neighborId)) {
          stack.push(neighborId)
          context.frontierNodes.add(neighborId)

          const neighbor = this.nodes.get(neighborId)!
          this.capture(context, "push", {
            activeNode: neighborId,
            visitedNodes: new Set(visited),
            frontierNodes: new Set(stack),
            message: `Push neighbor ${neighbor.label} onto stack.`,
            aiExplanation: `Found unvisited neighbor ${neighbor.label}. Push to stack to explore deeper.`,
          })

          pushedNeighbor = true
          break
        }
      }

      if (!pushedNeighbor) {
        stack.pop()
        context.frontierNodes.delete(currentId)

        if (visited.has(currentId)) {
          this.capture(context, "pop", {
            activeNode: currentId,
            visitedNodes: new Set(visited),
            frontierNodes: new Set(stack),
            message: `Pop node ${current.label} (all neighbors visited).`,
            aiExplanation: `All neighbors of ${current.label} already visited or in stack. Backtrack by popping.`,
          })
        }
      }
    }

    this.capture(context, "complete", {
      visitedNodes: new Set(visited),
      message: "DFS complete. All reachable nodes visited.",
      aiExplanation:
        "Stack is empty. All nodes reachable from the start have been visited using depth-first order.",
    })

    return context.snapshots
  }

  addNode(label?: string): GraphSnapshotStep[] {
    const context = this.createContext("add-node")
    const nodeLabel = label ?? String(this.nextNodeId)

    const positions = this.generatePosition()
    const newNode = new GraphNode(
      this.nextNodeId++,
      nodeLabel,
      positions.x,
      positions.y
    )
    this.nodes.set(newNode.id, newNode)

    this.capture(context, "add-node", {
      activeNode: newNode.id,
      message: `Added node ${newNode.label}.`,
      aiExplanation: `Created new node ${newNode.label} at position (${positions.x}, ${positions.y}).`,
    })

    return context.snapshots
  }

  addEdge(fromId: number, toId: number): GraphSnapshotStep[] {
    const context = this.createContext("add-edge")
    const fromNode = this.nodes.get(fromId)
    const toNode = this.nodes.get(toId)

    if (!fromNode || !toNode) {
      this.capture(context, "complete", {
        message: "One or both nodes not found.",
        aiExplanation: "Cannot add edge to non-existent nodes.",
      })
      return context.snapshots
    }

    const edgeKey = `${fromId}-${toId}`
    if (this.edgeSet.has(edgeKey)) {
      this.capture(context, "complete", {
        message: `Edge ${fromNode.label} → ${toNode.label} already exists.`,
        aiExplanation: "Duplicate edge detected. Skipping.",
      })
      return context.snapshots
    }

    this.edgeSet.add(edgeKey)
    fromNode.neighbors.add(toId)
    toNode.neighbors.add(fromId)
    context.edges = this.getEdges()

    this.capture(context, "add-edge", {
      activeNode: fromId,
      message: `Added edge between ${fromNode.label} and ${toNode.label}.`,
      aiExplanation: `Connected ${fromNode.label} and ${toNode.label} with an undirected edge.`,
    })

    return context.snapshots
  }

  reset(): void {
    this.nodes.clear()
    this.nextNodeId = 1
    this.nextSnapshotIndex = 0
    this.edgeSet.clear()
    this.createDefaultGraph()
  }

  private createDefaultGraph(): void {
    const defaultNodes = [
      { label: "A", x: 300, y: 80 },
      { label: "B", x: 150, y: 200 },
      { label: "C", x: 450, y: 200 },
      { label: "D", x: 80, y: 340 },
      { label: "E", x: 220, y: 340 },
      { label: "F", x: 380, y: 340 },
      { label: "G", x: 520, y: 340 },
    ]

    const defaultEdges = [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
      [2, 6],
      [3, 4],
      [5, 6],
    ]

    for (const { label, x, y } of defaultNodes) {
      const node = new GraphNode(this.nextNodeId++, label, x, y)
      this.nodes.set(node.id, node)
    }

    for (const [fromIdx, toIdx] of defaultEdges) {
      const fromNode = this.nodes.get(fromIdx + 1)!
      const toNode = this.nodes.get(toIdx + 1)!
      fromNode.neighbors.add(toNode.id)
      toNode.neighbors.add(fromNode.id)
      this.edgeSet.add(`${fromNode.id}-${toNode.id}`)
    }
  }

  private createContext(operation: GraphOperation): SnapshotContext {
    return {
      operation,
      snapshots: [],
      nodes: new Map(this.nodes),
      edges: this.getEdges(),
      visitedNodes: new Set(),
      frontierNodes: new Set(),
    }
  }

  private getEdges(): [number, number][] {
    const edges: [number, number][] = []
    const seen = new Set<string>()

    for (const node of this.nodes.values()) {
      for (const neighborId of node.neighbors) {
        const key = [
          Math.min(node.id, neighborId),
          Math.max(node.id, neighborId),
        ].join("-")
        if (!seen.has(key)) {
          seen.add(key)
          edges.push([node.id, neighborId])
        }
      }
    }

    return edges
  }

  private getFirstNode(): GraphNode | undefined {
    return this.nodes.values().next().value
  }

  private generatePosition(): { x: number; y: number } {
    const count = this.nodes.size
    const cols = Math.ceil(Math.sqrt(count))
    const row = Math.floor(count / cols)
    const col = count % cols
    const spacingX = 120
    const spacingY = 120
    const offsetX = 100
    const offsetY = 80
    return {
      x: offsetX + col * spacingX,
      y: offsetY + row * spacingY,
    }
  }

  private capture(
    context: SnapshotContext,
    phase: GraphPhase,
    options: {
      activeNode?: number
      visitedNodes?: Set<number>
      frontierNodes?: Set<number>
      message: string
      aiExplanation: string
    }
  ): void {
    context.snapshots.push({
      index: this.nextSnapshotIndex++,
      operation: context.operation,
      phase,
      nodes: this.serializeNodes(context.nodes),
      edges: context.edges.length > 0 ? context.edges : this.getEdges(),
      activeNode: options.activeNode,
      visitedNodes: options.visitedNodes ?? new Set(context.visitedNodes),
      frontierNodes: options.frontierNodes ?? new Set(context.frontierNodes),
      message: options.message,
      aiExplanation: options.aiExplanation,
    })
  }

  private serializeNodes(nodes: Map<number, GraphNode>): SerializedGraphNode[] {
    return Array.from(nodes.values()).map((node) => ({
      id: node.id,
      label: node.label,
      x: node.x,
      y: node.y,
      neighbors: Array.from(node.neighbors),
    }))
  }
}
