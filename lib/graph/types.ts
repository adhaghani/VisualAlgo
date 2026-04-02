export type GraphOperation = "bfs" | "dfs" | "add-edge" | "add-node"

export type GraphPhase =
  | "start"
  | "visit"
  | "explore"
  | "enqueue"
  | "dequeue"
  | "push"
  | "pop"
  | "backtrack"
  | "complete"
  | "add-node"
  | "add-edge"

export type SerializedGraphNode = {
  id: number
  label: string
  x: number
  y: number
  neighbors: number[]
}

export type GraphSnapshotStep = {
  index: number
  operation: GraphOperation
  phase: GraphPhase
  nodes: SerializedGraphNode[]
  edges: [number, number][]
  activeNode?: number
  visitedNodes: Set<number>
  frontierNodes: Set<number>
  message: string
  aiExplanation: string
}
